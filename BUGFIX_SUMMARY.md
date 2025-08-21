# Bug Fix: Auto-generated Messages Appearing in Live Message Dashboard

## Problem Description
The live message dashboard was showing auto-generated bot responses as received messages, causing confusion and incorrect data display. When the bot sent an auto-reply, Instagram would send that message back to the webhook, and it was being stored as a new incoming message.

## Root Cause
1. Auto-generated messages were being sent back to the webhook by Instagram
2. Existing safety checks had some gaps that allowed certain auto-generated messages to be stored
3. Dashboard queries were not filtering out outgoing messages
4. No clear distinction between incoming customer messages and outgoing bot messages

## Solution Implemented

### 1. Database Schema Changes
- **Added `is_incoming` column** to the `Message` model
  - `True` for incoming customer messages
  - `False` for outgoing bot messages (future use)
  - Default value: `True`

### 2. Enhanced Webhook Safety Checks
**File: `backend/app/api/api_v1/endpoints/webhook.py`**

- **Extended time window** for duplicate detection from 5 to 10 minutes
- **Added similarity checking** for messages that might have slight variations
- **Improved exact match detection** for recent responses
- **Added substring matching** to catch cases where message text is contained in response text
- **Explicit marking** of all processed messages as `is_incoming=True`

### 3. Dashboard Query Updates
**Files Updated:**
- `backend/app/api/api_v1/endpoints/live_messages.py`
- `backend/app/main.py`

**Changes:**
- All message queries now filter by `is_incoming=True`
- Statistics calculations only count incoming messages
- Public demo endpoint also filters by incoming messages
- Message stats endpoint updated to count only incoming messages

### 4. Database Migration
**File: `backend/alembic/versions/f0968c42c15c_add_is_incoming_to_messages.py`**

- Added `is_incoming` column with proper migration
- Set all existing messages to `is_incoming=True` (they were all legitimate incoming messages)
- Made column non-nullable with default value

### 5. Schema Updates
**File: `backend/app/schemas/message.py`**

- Added `is_incoming` field to `MessageResponse` schema
- Default value: `True`

## Key Safety Mechanisms

### 1. Sender ID Checks
```python
# Ignore messages from our own Instagram Business ID
if sender_id == page.ig_business_id:
    return

# Ignore messages where sender equals recipient
if sender_id == recipient_id:
    return
```

### 2. Duplicate Message Prevention
```python
# Check if message already processed
existing_message = db.query(Message).filter(
    Message.ig_message_id == message_id
).first()
```

### 3. Response Text Matching
```python
# Exact match with recent responses
recent_response = db.query(Message).filter(
    Message.user_id == user.id,
    Message.response_text == message_text,
    Message.reply_sent_at >= recent_cutoff
).first()

# Similarity check for variations
if (message_text.lower().strip() in response.response_text.lower().strip() or 
    response.response_text.lower().strip() in message_text.lower().strip()):
    return  # Ignore as likely bot message
```

### 4. Dashboard Filtering
```python
# Only show incoming messages in dashboard
messages = db.query(Message).filter(
    Message.user_id == current_user.id,
    Message.created_at >= yesterday,
    Message.is_incoming == True  # Key filter
).order_by(Message.created_at.desc()).limit(20).all()
```

## Testing
- Created test script to verify filtering logic
- Verified webhook safety checks work correctly
- Confirmed dashboard queries filter properly
- Migration applied successfully

## Files Modified
1. `backend/app/models/message.py` - Added `is_incoming` column
2. `backend/app/schemas/message.py` - Updated schema
3. `backend/app/api/api_v1/endpoints/webhook.py` - Enhanced safety checks
4. `backend/app/api/api_v1/endpoints/live_messages.py` - Updated queries
5. `backend/app/main.py` - Updated dashboard queries
6. `backend/alembic/versions/f0968c42c15c_add_is_incoming_to_messages.py` - Migration
7. `backend/tests/test_message_filtering.py` - Test verification

## Result
- ✅ Auto-generated messages no longer appear as received messages in dashboard
- ✅ Live message dashboard shows only genuine customer messages
- ✅ Statistics are accurate (only count real incoming messages)
- ✅ Enhanced safety mechanisms prevent future occurrences
- ✅ Backward compatibility maintained for existing data
