# Gemini 2.0 Flash + LangChain Integration Guide

This guide explains how InstaReply uses Google's Gemini 2.0 Flash model with LangChain for advanced AI-powered customer service automation.

## 🧠 AI Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Message  │───►│   LangChain     │───►│   Gemini 2.0    │
│                 │    │   Manager       │    │   Flash         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Response      │
                    │   Generation    │
                    └─────────────────┘
```

## 🔧 Key Components

### 1. LangChain Manager (`app/core/langchain_config.py`)
Centralized configuration for all LangChain operations:
- **Model**: Gemini 2.0 Flash Experimental
- **Embeddings**: Google Embedding Model 001
- **Chains**: Pre-configured for different tasks
- **Memory**: Conversation buffer for context

### 2. Gemini Service (`app/services/gemini_service.py`)
High-level interface for AI operations:
- Embedding generation
- Response personalization
- Sentiment analysis
- Intent extraction

### 3. Enhanced FAQ Service (`app/services/faq_service.py`)
Advanced FAQ management with AI features:
- Smart response generation
- Context analysis
- FAQ suggestions from interactions
- Similarity matching

## 🚀 Features

### 1. **Smart Response Generation**
```python
# FAQ-based response
response = await faq_service.find_matching_faq(db, user_id, message)

# AI fallback response
smart_response = await faq_service.find_smart_response(db, user_id, message)
```

### 2. **Sentiment Analysis**
```python
sentiment = await gemini_service.analyze_sentiment(message)
# Returns: {"positive": 0.8, "negative": 0.1, "neutral": 0.1, "overall": "positive"}
```

### 3. **Intent Extraction**
```python
intent = await gemini_service.extract_intent(message)
# Returns: "question", "complaint", "compliment", etc.
```

### 4. **Context-Aware Responses**
```python
context = await faq_service.analyze_message_context(db, user_id, message)
response = await gemini_service.generate_smart_response(message, context)
```

### 5. **Automatic FAQ Suggestions**
```python
suggestions = await faq_service.improve_faq_from_interactions(db, user_id)
# Analyzes unmatched messages to suggest new FAQs
```

## 🔧 Configuration

### Environment Variables
```bash
# Google Gemini API
GOOGLE_API_KEY=your_google_gemini_api_key
```

### LangChain Settings
```python
# Model Configuration
model = "gemini-2.0-flash-exp"
temperature = 0.7
max_output_tokens = 1024

# Embedding Model
embedding_model = "models/embedding-001"
```

## 📊 API Endpoints

### Enhanced FAQ Testing
```bash
# Test FAQ matching
POST /api/v1/faqs/test-match
{
  "message": "What are your hours?"
}

# Test smart response (FAQ + AI fallback)
POST /api/v1/faqs/test-smart-response
{
  "message": "I'm having trouble with my order"
}

# Analyze message context
POST /api/v1/faqs/analyze-message
{
  "message": "This is terrible service!"
}

# Get FAQ suggestions
GET /api/v1/faqs/suggestions
```

## 🎯 Response Flow

### 1. Message Received
```
Instagram DM → Webhook → Message Processing
```

### 2. Context Analysis
```python
# Extract sentiment and intent
sentiment = await analyze_sentiment(message)
intent = await extract_intent(message)
history = get_recent_messages(user_id)

context = {
    "sentiment": sentiment,
    "intent": intent,
    "history": history
}
```

### 3. Response Generation
```python
# Try FAQ matching first
faq_match = await find_matching_faq(message)

if faq_match:
    # Personalize FAQ answer
    response = await generate_response(message, faq_match.answer)
else:
    # Generate contextual AI response
    response = await generate_smart_response(message, context)
```

### 4. Response Delivery
```
Generated Response → Instagram API → User
```

## 🧪 Testing & Development

### Local Testing
```bash
# Start backend with Gemini integration
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Test endpoints
curl -X POST "http://localhost:8000/api/v1/faqs/test-smart-response" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need help with my order"}'
```

### Response Quality Testing
1. **FAQ Matching**: Test with known FAQ questions
2. **Sentiment Analysis**: Test with positive/negative messages
3. **Intent Recognition**: Test with different message types
4. **Context Awareness**: Test with conversation history

## 🔍 Monitoring & Analytics

### Key Metrics
- **Response Accuracy**: FAQ match success rate
- **Sentiment Distribution**: Customer mood analysis
- **Intent Categories**: Most common customer needs
- **Response Time**: AI processing speed
- **Fallback Rate**: When AI generates responses vs FAQ matches

### Logging
```python
# Automatic logging for all AI operations
logger.info(f"FAQ match found: {faq_match.similarity_score}")
logger.info(f"Sentiment: {sentiment['overall']}")
logger.info(f"Intent: {intent}")
logger.info(f"Response generated in {processing_time}ms")
```

## 🚀 Advanced Features

### 1. **Conversation Memory**
LangChain maintains conversation context:
```python
# Remembers last 5 message exchanges
conversation_chain = ConversationChain(
    llm=llm,
    memory=ConversationBufferWindowMemory(k=5)
)
```

### 2. **Dynamic FAQ Improvement**
System learns from interactions:
```python
# Analyzes unmatched messages
unmatched = get_unmatched_messages()
suggestions = cluster_similar_messages(unmatched)
new_faqs = generate_faq_suggestions(suggestions)
```

### 3. **Multi-Language Support** (Future)
```python
# Detect language and respond accordingly
language = await detect_language(message)
response = await generate_response(message, faq_answer, language)
```

## 🔒 Security & Privacy

### Data Protection
- **No Data Storage**: Gemini API calls don't store data
- **Encrypted Tokens**: All API keys encrypted at rest
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs

### Compliance
- **GDPR Ready**: User data handling compliant
- **SOC 2**: Security controls implemented
- **Privacy First**: Minimal data collection

## 🛠️ Troubleshooting

### Common Issues

1. **API Key Invalid**
   ```bash
   Error: 403 Forbidden
   Solution: Check GOOGLE_API_KEY in .env
   ```

2. **Rate Limit Exceeded**
   ```bash
   Error: 429 Too Many Requests
   Solution: Implement exponential backoff
   ```

3. **Model Not Found**
   ```bash
   Error: Model gemini-2.0-flash-exp not found
   Solution: Check model availability in your region
   ```

4. **Embedding Dimension Mismatch**
   ```bash
   Error: Embedding dimensions don't match
   Solution: Regenerate all embeddings with same model
   ```

### Performance Optimization

1. **Batch Processing**: Use batch embedding generation
2. **Caching**: Cache frequent embeddings in Redis
3. **Async Operations**: All AI calls are asynchronous
4. **Connection Pooling**: Reuse HTTP connections

## 📚 Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [LangChain Documentation](https://python.langchain.com/)
- [Gemini 2.0 Flash Model Info](https://ai.google.dev/models/gemini)
- [LangChain Google Integration](https://python.langchain.com/docs/integrations/llms/google_ai)

## 🔄 Migration from OpenAI

If migrating from OpenAI:

1. **Update Dependencies**:
   ```bash
   pip uninstall openai
   pip install google-generativeai langchain-google-genai
   ```

2. **Update Environment**:
   ```bash
   # Remove
   OPENAI_API_KEY=...
   
   # Add
   GOOGLE_API_KEY=your_gemini_key
   ```

3. **Regenerate Embeddings**:
   ```python
   # All existing FAQ embeddings need regeneration
   await faq_service.regenerate_all_embeddings()
   ```

4. **Test Thoroughly**:
   - Response quality may differ
   - Adjust similarity thresholds
   - Update prompt templates if needed

---

**InstaReply with Gemini 2.0 Flash** - Next-generation AI customer service automation with advanced language understanding and context awareness.
