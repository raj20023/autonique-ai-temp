from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class InstagramMessage(BaseModel):
    id: str
    text: str
    from_: Dict[str, str]  # Instagram user info
    timestamp: str

class WebhookEntry(BaseModel):
    id: str  # Page ID
    time: int
    messaging: Optional[List[Dict[str, Any]]] = None

class WebhookEvent(BaseModel):
    object: str
    entry: List[WebhookEntry]

class WebhookVerification(BaseModel):
    mode: str
    token: str
    challenge: str
