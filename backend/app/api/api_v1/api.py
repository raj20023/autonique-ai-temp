from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, faqs, webhook, pages, system

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(pages.router, prefix="/pages", tags=["pages"])
api_router.include_router(faqs.router, prefix="/faqs", tags=["faqs"])
api_router.include_router(webhook.router, prefix="/webhook", tags=["webhook"])
api_router.include_router(system.router, prefix="/system", tags=["system"])
