# AgriGuru 4.0 - Quick Start Guide

## 🚀 Running the Application

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### 1. Backend Server
```bash
cd backend
npm install
node server.js
```
**Server will run on:** http://localhost:5000

### 2. Frontend Application
```bash
cd frontend
npm install
npm start
```
**Application will run on:** http://localhost:3000

### 3. Quick Test (Browser)
Open `chatbot-test.html` in your browser for immediate chatbot testing.

## 🤖 Chatbot Features

### Current Capabilities
- **Natural Language Processing**: Understands farming queries in plain English
- **Intent Classification**: Automatically routes to appropriate modules
- **Module Integration**: Access all features through conversation
- **Context Awareness**: Remembers location and user preferences
- **Suggestions**: Provides helpful follow-up questions

### Supported Intents
1. **Crop Calendar** - "When should I plant wheat?"
2. **Weather** - "What's the weather forecast?"
3. **Market Prices** - "Show me current mandi prices"
4. **Soil Analysis** - "I need soil testing help"
5. **Pest/Disease** - "My plants have brown spots"
6. **Government Schemes** - "What subsidies are available?"
7. **Sustainable Practices** - "Tell me about organic farming"
8. **Emergency** - "Help! My crops are dying!"

### Example Conversations
```
User: "I want to grow tomatoes in Delhi"
Bot: "I can help you create a tomato growing plan for Delhi! Let me prepare a crop calendar with optimal planting times, weather considerations, and care schedule."

User: "What are potato prices today?"
Bot: "Let me fetch the current mandi prices for potatoes in your area..."

User: "My tomato leaves are turning yellow"
Bot: "Yellow leaves can indicate several issues. Can you share a photo for AI analysis, or describe any other symptoms you've noticed?"
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Required for full LLM integration
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Optional API keys for enhanced features
OPENWEATHER_API_KEY=your_openweather_key
NASA_API_KEY=your_nasa_key
```

### Without API Keys
The application works with fallback responses and simulated data when API keys are not provided.

## 📱 User Interface

### Main Application
- Access the full React application at http://localhost:3000
- Chatbot appears as a floating button in the bottom-right corner
- Click to open the conversational interface

### Test Interface
- Open `chatbot-test.html` for standalone chatbot testing
- No need to run the frontend server
- Direct API communication for quick testing

## 🧪 Testing

### API Testing
```bash
cd backend
node test-chatbot.js
```

### Manual Testing
1. Open the test interface in browser
2. Try various agricultural queries
3. Test with and without location services
4. Verify intent classification accuracy

## 🌟 Key Features

### 1. Intelligent Routing
The chatbot automatically determines which agricultural module to use based on your query.

### 2. Context Awareness
- Remembers your location for weather and market data
- Maintains conversation history
- Provides personalized recommendations

### 3. Multi-Modal Support
- Text-based conversations
- Image analysis for disease identification
- Location-based services

### 4. Fallback System
- Works without internet for basic functions
- Gracefully handles API failures
- Provides helpful error messages

## 🔍 Troubleshooting

### Backend Issues
- **Port 5000 in use**: Kill existing processes with `taskkill /PID <pid> /F`
- **API errors**: Check `.env` file configuration
- **Module not found**: Run `npm install` in backend directory

### Frontend Issues
- **Cannot connect**: Ensure backend is running on port 5000
- **Build errors**: Clear node_modules and reinstall
- **TypeScript errors**: Check component imports

### Chatbot Issues
- **No responses**: Verify backend server is running
- **Wrong intent**: Update intent patterns in `chatbotService.js`
- **API failures**: Check console logs for detailed error messages

## 🎯 Development Tips

### Adding New Intents
1. Update `intentPatterns` in `chatbotService.js`
2. Add handler method in `routeToModule()`
3. Create module integration function
4. Test with various query phrases

### Customizing Responses
1. Modify `generateTemplateResponse()` for custom messages
2. Update suggestion arrays for better user guidance
3. Add new conversation patterns

### Performance Optimization
1. Implement response caching
2. Add request throttling
3. Optimize database queries
4. Use CDN for static assets

## 📈 Monitoring

### Conversation Analytics
- Track popular intents
- Monitor response accuracy
- Analyze user satisfaction ratings

### Performance Metrics
- Response time monitoring
- API success rates
- Error frequency tracking

---

**Happy Farming! 🌾**

For support, please check the GitHub repository at https://github.com/Himanshuv20/Agriguruv4
