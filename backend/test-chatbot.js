const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

// Test data
const testContext = {
    location: {
        latitude: 28.6139,
        longitude: 77.2090
    },
    crop: 'wheat',
    area: 2,
    soilType: 'loamy'
};

const testMessages = [
    'Hello, can you help me with farming?',
    'What is the weather forecast for next week?',
    'When should I plant wheat?',
    'Show me current mandi prices',
    'I need soil analysis for my farm',
    'My plants have brown spots on leaves, what should I do?',
    'Tell me about government schemes for farmers',
    'What are some sustainable farming practices?',
    'Emergency: my crops are dying!',
];

async function testChatbotAPI() {
    console.log('🤖 Testing Chatbot API Integration\n');
    console.log('=' * 50);

    const userId = 'test-user-' + Date.now();
    let conversationCount = 0;

    for (const message of testMessages) {
        try {
            console.log(`\n📤 User: ${message}`);
            
            const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
                message,
                userId,
                context: testContext
            });

            if (response.data.success) {
                console.log(`🤖 Bot: ${response.data.response}`);
                console.log(`🎯 Intent: ${response.data.intent || 'Not detected'}`);
                
                if (response.data.suggestions && response.data.suggestions.length > 0) {
                    console.log(`💡 Suggestions: ${response.data.suggestions.join(', ')}`);
                }
                
                conversationCount++;
            } else {
                console.log(`❌ Error: ${response.data.error}`);
            }

            // Add delay between messages
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.log(`❌ Request failed: ${error.message}`);
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
            }
        }
    }

    console.log(`\n📊 Test Summary:`);
    console.log(`   Messages sent: ${testMessages.length}`);
    console.log(`   Successful responses: ${conversationCount}`);
    console.log(`   User ID: ${userId}`);

    // Test conversation history
    try {
        console.log(`\n📜 Testing conversation history...`);
        const historyResponse = await axios.get(`${API_BASE_URL}/api/chatbot/conversation/${userId}`);
        
        if (historyResponse.data.success) {
            console.log(`✅ History retrieved: ${historyResponse.data.count} messages`);
        } else {
            console.log(`❌ Failed to retrieve history`);
        }
    } catch (error) {
        console.log(`❌ History request failed: ${error.message}`);
    }

    // Test feedback submission
    try {
        console.log(`\n⭐ Testing feedback submission...`);
        const feedbackResponse = await axios.post(`${API_BASE_URL}/api/chatbot/feedback`, {
            userId,
            messageId: 'test-message-1',
            rating: 5,
            feedback: 'Great chatbot experience!'
        });
        
        if (feedbackResponse.data.success) {
            console.log(`✅ Feedback submitted successfully`);
        } else {
            console.log(`❌ Failed to submit feedback`);
        }
    } catch (error) {
        console.log(`❌ Feedback request failed: ${error.message}`);
    }

    // Test intents endpoint
    try {
        console.log(`\n🎯 Testing intents endpoint...`);
        const intentsResponse = await axios.get(`${API_BASE_URL}/api/chatbot/intents`);
        
        if (intentsResponse.data.success) {
            const intentCount = Object.keys(intentsResponse.data.intents).length;
            console.log(`✅ Retrieved ${intentCount} available intents`);
            console.log(`   Intents: ${Object.keys(intentsResponse.data.intents).join(', ')}`);
        } else {
            console.log(`❌ Failed to retrieve intents`);
        }
    } catch (error) {
        console.log(`❌ Intents request failed: ${error.message}`);
    }

    // Test conversation clearing
    try {
        console.log(`\n🗑️ Testing conversation clearing...`);
        const clearResponse = await axios.delete(`${API_BASE_URL}/api/chatbot/conversation/${userId}`);
        
        if (clearResponse.data) {
            console.log(`✅ Conversation cleared successfully`);
        } else {
            console.log(`❌ Failed to clear conversation`);
        }
    } catch (error) {
        console.log(`❌ Clear conversation request failed: ${error.message}`);
    }

    console.log(`\n🎉 Chatbot API testing completed!`);
}

async function testIntentClassification() {
    console.log('\n🧠 Testing Intent Classification\n');
    console.log('=' * 50);

    const intentTestCases = [
        { message: 'When should I plant rice?', expectedIntent: 'crop_calendar' },
        { message: 'What\'s the weather like today?', expectedIntent: 'weather' },
        { message: 'Show me potato prices in the market', expectedIntent: 'mandi_prices' },
        { message: 'My soil needs testing', expectedIntent: 'soil_analysis' },
        { message: 'Help! My plants are dying!', expectedIntent: 'emergency' },
        { message: 'I want to start organic farming', expectedIntent: 'sustainable_practices' },
        { message: 'What government schemes are available?', expectedIntent: 'government_schemes' },
        { message: 'My crops have white spots', expectedIntent: 'pest_disease' },
    ];

    let correctPredictions = 0;

    for (const testCase of intentTestCases) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
                message: testCase.message,
                userId: 'intent-test-user',
                context: testContext
            });

            const predictedIntent = response.data.intent;
            const isCorrect = predictedIntent === testCase.expectedIntent;
            
            if (isCorrect) {
                correctPredictions++;
                console.log(`✅ "${testCase.message}" → ${predictedIntent}`);
            } else {
                console.log(`❌ "${testCase.message}" → Expected: ${testCase.expectedIntent}, Got: ${predictedIntent}`);
            }

        } catch (error) {
            console.log(`❌ Error testing "${testCase.message}": ${error.message}`);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    const accuracy = (correctPredictions / intentTestCases.length) * 100;
    console.log(`\n📊 Intent Classification Accuracy: ${accuracy.toFixed(1)}% (${correctPredictions}/${intentTestCases.length})`);
}

async function testModuleIntegration() {
    console.log('\n🔗 Testing Module Integration\n');
    console.log('=' * 50);

    const moduleTests = [
        {
            name: 'Crop Calendar',
            message: 'Create crop calendar for wheat in Delhi',
            context: { ...testContext, crop: 'wheat' }
        },
        {
            name: 'Weather Service',
            message: 'Get weather forecast',
            context: testContext
        },
        {
            name: 'Mandi Data',
            message: 'Show mandi prices',
            context: testContext
        },
        {
            name: 'Soil Analysis',
            message: 'Analyze soil health',
            context: testContext
        }
    ];

    for (const test of moduleTests) {
        try {
            console.log(`\n🧪 Testing ${test.name}...`);
            
            const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
                message: test.message,
                userId: 'module-test-user',
                context: test.context
            });

            if (response.data.success) {
                console.log(`✅ ${test.name} integration working`);
                console.log(`   Response length: ${response.data.response.length} characters`);
                
                if (response.data.data) {
                    console.log(`   Module data returned: Yes`);
                } else {
                    console.log(`   Module data returned: No`);
                }
            } else {
                console.log(`❌ ${test.name} integration failed: ${response.data.error}`);
            }

        } catch (error) {
            console.log(`❌ ${test.name} test failed: ${error.message}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Main test function
async function runAllTests() {
    console.log('🚀 Starting Comprehensive Chatbot Testing');
    console.log('=' * 60);
    
    try {
        await testChatbotAPI();
        await testIntentClassification(); 
        await testModuleIntegration();
        
        console.log('\n✅ All tests completed successfully!');
        console.log('\n📝 Notes:');
        console.log('   - Make sure the backend server is running on port 5000');
        console.log('   - Add OPENAI_API_KEY to .env for full LLM integration');
        console.log('   - Fallback responses are used when API keys are not available');
        
    } catch (error) {
        console.log(`\n❌ Test suite failed: ${error.message}`);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}

module.exports = {
    testChatbotAPI,
    testIntentClassification,
    testModuleIntegration,
    runAllTests
};
