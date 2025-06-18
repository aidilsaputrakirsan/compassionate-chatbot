const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { 
  generateCulturalResponse, 
  detectContext, 
  detectTopic,
  getResponseMetrics 
} = require('./cultural-engine');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data storage paths
const DATA_DIR = path.join(__dirname, 'research-data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const RATINGS_FILE = path.join(DATA_DIR, 'ratings.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Initialize data storage
async function initializeDataStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize files if they don't exist
    const files = [
      { path: SESSIONS_FILE, data: [] },
      { path: RATINGS_FILE, data: [] },
      { path: ANALYTICS_FILE, data: { totalSessions: 0, totalMessages: 0, averageRating: 0 } }
    ];
    
    for (const file of files) {
      try {
        await fs.access(file.path);
      } catch {
        await fs.writeFile(file.path, JSON.stringify(file.data, null, 2));
      }
    }
    
    console.log('📁 Data storage initialized');
  } catch (error) {
    console.error('❌ Failed to initialize data storage:', error);
  }
}

// Helper functions for data management
async function readJSONFile(filepath) {
  try {
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filepath}:`, error);
    return [];
  }
}

async function writeJSONFile(filepath, data) {
  try {
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filepath}:`, error);
  }
}

async function logInteraction(sessionId, userMessage, botResponse, metadata) {
  try {
    const sessions = await readJSONFile(SESSIONS_FILE);
    
    const interaction = {
      sessionId,
      timestamp: new Date().toISOString(),
      userMessage,
      botResponse,
      metadata,
      id: Date.now() + Math.random()
    };
    
    sessions.push(interaction);
    await writeJSONFile(SESSIONS_FILE, sessions);
    
    // Update analytics
    await updateAnalytics();
    
  } catch (error) {
    console.error('Error logging interaction:', error);
  }
}

async function logRating(ratingData) {
  try {
    const ratings = await readJSONFile(RATINGS_FILE);
    ratings.push({
      ...ratingData,
      timestamp: new Date().toISOString(),
      id: Date.now() + Math.random()
    });
    await writeJSONFile(RATINGS_FILE, ratings);
    
    // Update analytics
    await updateAnalytics();
    
  } catch (error) {
    console.error('Error logging rating:', error);
  }
}

async function updateAnalytics() {
  try {
    const sessions = await readJSONFile(SESSIONS_FILE);
    const ratings = await readJSONFile(RATINGS_FILE);
    
    const uniqueSessions = new Set(sessions.map(s => s.sessionId)).size;
    const totalMessages = sessions.length;
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;
    
    const analytics = {
      totalSessions: uniqueSessions,
      totalMessages,
      averageRating: Math.round(averageRating * 100) / 100,
      lastUpdated: new Date().toISOString(),
      
      // Context distribution
      contextDistribution: {},
      hierarchyDistribution: {},
      formalityDistribution: {},
      
      // Rating distribution
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      
      // Topics discussed
      topicDistribution: {}
    };
    
    // Calculate distributions
    sessions.forEach(session => {
      const { context, hierarchy, formality, topic } = session.metadata;
      
      analytics.contextDistribution[context] = (analytics.contextDistribution[context] || 0) + 1;
      analytics.hierarchyDistribution[hierarchy] = (analytics.hierarchyDistribution[hierarchy] || 0) + 1;
      analytics.formalityDistribution[formality] = (analytics.formalityDistribution[formality] || 0) + 1;
      
      if (topic && topic !== 'general') {
        analytics.topicDistribution[topic] = (analytics.topicDistribution[topic] || 0) + 1;
      }
    });
    
    ratings.forEach(rating => {
      analytics.ratingDistribution[rating.rating] = (analytics.ratingDistribution[rating.rating] || 0) + 1;
    });
    
    await writeJSONFile(ANALYTICS_FILE, analytics);
    
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
}

// API ENDPOINTS

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Compassionate AI Backend connected!',
    version: '2.0.0',
    features: ['cultural-adaptation', 'hierarchy-awareness', 'analytics', 'rating-system'],
    timestamp: new Date().toISOString()
  });
});

// Main chat endpoint with comprehensive logging
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { 
      message, 
      hierarchy = 'student-to-staff', 
      formality = 'casual',
      sessionId 
    } = req.body;
    
    console.log(`\n🔄 Processing message from session: ${sessionId}`);
    console.log(`📨 User: "${message}"`);
    console.log(`🏛️ Context: ${hierarchy} | ${formality}`);
    
    // Generate cultural response
    const context = detectContext(message);
    const { topic, info, category } = detectTopic(message);
    const culturalResponse = generateCulturalResponse(message, hierarchy, formality);
    
    const responseTime = Date.now() - startTime;
    
    // Prepare response metadata
    const metadata = {
      detected_context: context,
      hierarchy,
      formality,
      topic,
      category,
      responseTime,
      messageLength: message.length,
      responseLength: culturalResponse.length,
      hasSpecificInfo: info.length > 0,
      culturalElements: {
        respectLevel: formality === 'formal' ? 'high' : 'medium',
        hierarchyAware: hierarchy !== 'peer-to-peer',
        indonesianContext: true
      }
    };
    
    // Log interaction for research
    await logInteraction(sessionId, message, culturalResponse, metadata);
    
    console.log(`✅ Response generated in ${responseTime}ms`);
    console.log(`🤖 Bot: "${culturalResponse.substring(0, 100)}..."`);
    
    res.json({
      response: culturalResponse,
      ...metadata,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Chat endpoint error:', error);
    res.status(500).json({
      response: "Maaf, terjadi error sistem. Coba lagi ya!",
      error: true,
      timestamp: new Date().toISOString()
    });
  }
});

// Rating endpoint
app.post('/api/rate', async (req, res) => {
  try {
    const { messageId, rating, feedback, hierarchy, formality, sessionId } = req.body;
    
    console.log(`⭐ Rating received: ${rating}/5 for message ${messageId}`);
    
    const ratingData = {
      messageId,
      rating: parseInt(rating),
      feedback: feedback || '',
      hierarchy,
      formality,
      sessionId
    };
    
    await logRating(ratingData);
    
    res.json({
      success: true,
      message: 'Rating saved successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Rating endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save rating'
    });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await readJSONFile(ANALYTICS_FILE);
    res.json(analytics);
  } catch (error) {
    console.error('❌ Analytics endpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Export research data endpoint
app.get('/api/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let data;
    let filename;
    
    switch (type) {
      case 'sessions':
        data = await readJSONFile(SESSIONS_FILE);
        filename = `chatbot-sessions-${new Date().toISOString().split('T')[0]}.json`;
        break;
      case 'ratings':
        data = await readJSONFile(RATINGS_FILE);
        filename = `chatbot-ratings-${new Date().toISOString().split('T')[0]}.json`;
        break;
      case 'analytics':
        data = await readJSONFile(ANALYTICS_FILE);
        filename = `chatbot-analytics-${new Date().toISOString().split('T')[0]}.json`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }
    
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
    
  } catch (error) {
    console.error('❌ Export endpoint error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Research summary endpoint
app.get('/api/research-summary', async (req, res) => {
  try {
    const [sessions, ratings, analytics] = await Promise.all([
      readJSONFile(SESSIONS_FILE),
      readJSONFile(RATINGS_FILE),
      readJSONFile(ANALYTICS_FILE)
    ]);
    
    // Calculate research insights
    const insights = {
      dataCollection: {
        totalSessions: analytics.totalSessions,
        totalInteractions: sessions.length,
        totalRatings: ratings.length,
        dataCompleteness: ratings.length / sessions.length * 100
      },
      
      culturalAdaptation: {
        hierarchyEffectiveness: {},
        formalityPreferences: analytics.formalityDistribution,
        contextAccuracy: analytics.contextDistribution
      },
      
      userSatisfaction: {
        overallRating: analytics.averageRating,
        ratingDistribution: analytics.ratingDistribution,
        satisfactionRate: (ratings.filter(r => r.rating >= 4).length / ratings.length) * 100
      },
      
      systemPerformance: {
        averageResponseTime: sessions.reduce((sum, s) => sum + (s.metadata.responseTime || 0), 0) / sessions.length,
        topicsHandled: Object.keys(analytics.topicDistribution).length,
        culturalElementsUsed: sessions.filter(s => s.metadata.culturalElements?.indonesianContext).length
      }
    };
    
    // Calculate hierarchy effectiveness
    const hierarchyRatings = {};
    ratings.forEach(rating => {
      if (!hierarchyRatings[rating.hierarchy]) {
        hierarchyRatings[rating.hierarchy] = [];
      }
      hierarchyRatings[rating.hierarchy].push(rating.rating);
    });
    
    Object.keys(hierarchyRatings).forEach(hierarchy => {
      const avgRating = hierarchyRatings[hierarchy].reduce((sum, r) => sum + r, 0) / hierarchyRatings[hierarchy].length;
      insights.culturalAdaptation.hierarchyEffectiveness[hierarchy] = Math.round(avgRating * 100) / 100;
    });
    
    res.json({
      insights,
      generatedAt: new Date().toISOString(),
      dataQuality: {
        sessions: sessions.length,
        ratings: ratings.length,
        completeness: `${Math.round((ratings.length / sessions.length) * 100)}%`
      }
    });
    
  } catch (error) {
    console.error('❌ Research summary error:', error);
    res.status(500).json({ error: 'Failed to generate research summary' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, async () => {
  console.log('\n🚀 Compassionate AI Research Server Starting...');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log('🎯 Features: Cultural Adaptation, Hierarchy Awareness, Analytics, Rating System');
  
  await initializeDataStorage();
  
  console.log('✅ Server ready for research data collection!');
  console.log('📊 Available endpoints:');
  console.log('   - POST /api/chat (main chatbot)');
  console.log('   - POST /api/rate (rating system)');
  console.log('   - GET /api/analytics (live analytics)');
  console.log('   - GET /api/export/:type (data export)');
  console.log('   - GET /api/research-summary (research insights)');
  console.log('');
});