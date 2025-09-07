from fastapi import APIRouter, Request, Query, Header
import logging

from app.api.api_v1.endpoints import auth, users, faqs, webhook, pages, system, live_messages, user_management

logger = logging.getLogger(__name__)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(pages.router, prefix="/pages", tags=["pages"])
api_router.include_router(faqs.router, prefix="/faqs", tags=["faqs"])
api_router.include_router(webhook.router, prefix="/webhook", tags=["webhook"])
api_router.include_router(system.router, prefix="/system", tags=["system"])

api_router.include_router(live_messages.router, prefix="/live", tags=["live-monitoring"])
api_router.include_router(user_management.router, prefix="/user-management", tags=["user-management"])

# Add webhook routes at root level for Facebook compatibility
from app.api.api_v1.endpoints.webhook import verify_webhook, handle_webhook

@api_router.get("/webhook")
async def webhook_verify_root(
    request: Request,
    hub_mode: str = Query(alias="hub.mode", default=None),
    hub_token: str = Query(alias="hub.verify_token", default=None),
    hub_challenge: str = Query(alias="hub.challenge", default=None)
):
    """Webhook verification at root level"""
    return await verify_webhook(request, hub_mode, hub_token, hub_challenge)

@api_router.post("/webhook")
async def webhook_handle_root(
    request: Request,
    x_hub_signature_256: str = Header(None, alias="X-Hub-Signature-256")
):
    """Webhook handler at root level"""
    return await handle_webhook(request, x_hub_signature_256)
