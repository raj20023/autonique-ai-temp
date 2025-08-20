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
    faq_service = FAQService()
    return await faq_service.create_faq_with_embedding(
        db, current_user.id, faq.question, faq.answer, faq.similarity_threshold
    )

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
    """Test FAQ matching for a message"""
    faq_service = FAQService()
    match = await faq_service.find_matching_faq(db, current_user.id, message)

    if match:
        return {
            "match_found": True,
            "faq": match,
            "message": "FAQ match found"
        }
    else:
        return {
            "match_found": False,
            "message": "No matching FAQ found"
        }


