from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import csv
import io
import logging

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.faq import FAQ
from app.schemas.faq import FAQCreate, FAQUpdate, FAQResponse, FAQBulkCreate, FAQMatch
from app.services.faq_service import FAQService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[FAQResponse])
def get_faqs(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's FAQs"""
    faq_service = FAQService()
    faqs = faq_service.get_user_faqs(db, current_user.id, skip, limit)
    return faqs

@router.post("/", response_model=FAQResponse)
async def create_faq(
    faq: FAQCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new FAQ"""
    try:
        faq_service = FAQService()
        return await faq_service.create_faq_with_embedding(
            db, current_user.id, faq.question, faq.answer, faq.similarity_threshold
        )
    except ValueError as e:
        if "quota exceeded" in str(e).lower():
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "API_QUOTA_EXCEEDED",
                    "message": "Google Gemini API quota exceeded. Please try again later or upgrade your API plan.",
                    "suggestion": "You can still use the platform, but FAQ creation requires API access. Consider upgrading your Gemini API plan for unlimited usage."
                }
            )
        else:
            raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error creating FAQ: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/simple", response_model=FAQResponse)
async def create_simple_faq(
    faq: FAQCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new FAQ without embeddings (fallback when API quota exceeded)"""
    try:
        # Create FAQ record without embedding
        new_faq = FAQ(
            user_id=current_user.id,
            question=faq.question,
            answer=faq.answer,
            embedding_vector=None,  # No embedding for now
            similarity_threshold=faq.similarity_threshold
        )

        db.add(new_faq)
        db.commit()
        db.refresh(new_faq)

        logger.info(f"✅ Created simple FAQ (no embedding) for user {current_user.id}: {faq.question[:50]}...")
        return new_faq

    except Exception as e:
        logger.error(f"Error creating simple FAQ: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create FAQ")

@router.post("/generate-embeddings")
async def generate_missing_embeddings(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate embeddings for FAQs that don't have them (when API quota is available)"""
    try:
        faq_service = FAQService()

        # Find FAQs without embeddings
        faqs_without_embeddings = db.query(FAQ).filter(
            FAQ.user_id == current_user.id,
            FAQ.embedding_vector.is_(None),
            FAQ.is_active == True
        ).all()

        if not faqs_without_embeddings:
            return {"message": "All FAQs already have embeddings", "updated_count": 0}

        updated_count = 0
        failed_count = 0

        for faq in faqs_without_embeddings:
            try:
                success = await faq_service.update_faq_embedding(db, faq.id)
                if success:
                    updated_count += 1
                else:
                    failed_count += 1
            except Exception as e:
                logger.error(f"Failed to generate embedding for FAQ {faq.id}: {e}")
                failed_count += 1
                # Continue with other FAQs

        return {
            "message": f"Generated embeddings for {updated_count} FAQs",
            "updated_count": updated_count,
            "failed_count": failed_count,
            "total_processed": len(faqs_without_embeddings)
        }

    except Exception as e:
        logger.error(f"Error generating missing embeddings: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate embeddings")

@router.post("/bulk", response_model=List[FAQResponse])
async def create_faqs_bulk(
    faqs_data: FAQBulkCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create multiple FAQs at once"""
    faq_service = FAQService()
    faq_list = [faq.dict() for faq in faqs_data.faqs]
    return await faq_service.bulk_create_faqs_with_embeddings(
        db, current_user.id, faq_list
    )

@router.post("/upload-csv", response_model=List[FAQResponse])
async def upload_faqs_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload FAQs from CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        content = await file.read()
        csv_data = content.decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(csv_data))
        
        faq_list = []
        for row in csv_reader:
            if 'question' in row and 'answer' in row:
                faq_list.append({
                    'question': row['question'].strip(),
                    'answer': row['answer'].strip(),
                    'similarity_threshold': float(row.get('similarity_threshold', 0.8))
                })
        
        if not faq_list:
            raise HTTPException(
                status_code=400, 
                detail="No valid FAQ data found. CSV must have 'question' and 'answer' columns"
            )
        
        faq_service = FAQService()
        return await faq_service.bulk_create_faqs_with_embeddings(
            db, current_user.id, faq_list
        )
        
    except Exception as e:
        logger.error(f"Error uploading CSV: {e}")
        raise HTTPException(status_code=400, detail="Error processing CSV file")

@router.get("/{faq_id}", response_model=FAQResponse)
def get_faq(
    faq_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific FAQ"""
    faq = db.query(FAQ).filter(
        FAQ.id == faq_id,
        FAQ.user_id == current_user.id
    ).first()
    
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    return faq

@router.put("/{faq_id}", response_model=FAQResponse)
async def update_faq(
    faq_id: int,
    faq_update: FAQUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update FAQ"""
    faq = db.query(FAQ).filter(
        FAQ.id == faq_id,
        FAQ.user_id == current_user.id
    ).first()
    
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    update_data = faq_update.dict(exclude_unset=True)
    
    # If question is updated, regenerate embedding
    question_updated = False
    for field, value in update_data.items():
        setattr(faq, field, value)
        if field == "question":
            question_updated = True
    
    db.commit()
    
    if question_updated:
        faq_service = FAQService()
        await faq_service.update_faq_embedding(db, faq_id)
    
    db.refresh(faq)
    return faq

@router.delete("/{faq_id}")
def delete_faq(
    faq_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete FAQ"""
    faq_service = FAQService()
    success = faq_service.delete_faq(db, faq_id, current_user.id)
    
    if not success:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    return {"message": "FAQ deleted successfully"}

@router.post("/test-match")
async def test_faq_match(
    message: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Test FAQ matching for a message (API quota safe - uses cached/fallback embeddings)"""
    faq_service = FAQService()

    # Use fallback matching to avoid consuming API quota
    match = await faq_service.find_matching_faq_fallback(db, current_user.id, message)

    if match:
        return {
            "match_found": True,
            "faq": match,
            "message": "FAQ match found (using fallback matching to preserve quota)",
            "note": "This uses cached embeddings or fallback matching to avoid API calls"
        }
    else:
        return {
            "match_found": False,
            "message": "No matching FAQ found (using fallback matching to preserve quota)",
            "note": "This uses cached embeddings or fallback matching to avoid API calls"
        }

@router.post("/test-smart-response")
async def test_smart_response(
    message: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Test the complete smart response system (DISABLED to preserve API quota)"""
    return {
        "success": False,
        "message": "Smart response testing is disabled to preserve API quota",
        "user_message": message,
        "note": "This endpoint has been disabled to prevent accidental API quota consumption. Use /faqs/test-smart-response-with-api if you need to test with actual API calls.",
        "suggestion": "Try creating actual FAQs and testing through the webhook system instead"
    }


