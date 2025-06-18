import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { 
      text: 'Halo! Saya chatbot kampus yang bisa membantu dengan berbagai informasi akademik, administrasi, dan fasilitas kampus. Ada yang bisa dibantu hari ini?', 
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Context controls
  const [hierarchy, setHierarchy] = useState('student-to-staff');
  const [formality, setFormality] = useState('casual');
  
  // Research data collection
  const [sessionData, setSessionData] = useState({
    startTime: new Date().toISOString(),
    totalMessages: 0,
    ratings: [],
    interactions: []
  });
  
  // UI states
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [currentRating, setCurrentRating] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      text: input, 
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: input,
        hierarchy: hierarchy,
        formality: formality,
        sessionId: sessionData.startTime
      });

      const botMessage = { 
        text: response.data.response, 
        sender: 'bot',
        timestamp: new Date().toISOString(),
        metadata: {
          context: response.data.detected_context,
          hierarchy: response.data.hierarchy,
          formality: response.data.formality,
          topic: response.data.topic,
          category: response.data.category,
          responseTime: response.data.responseTime
        },
        id: Date.now(), // For rating identification
        needsRating: true
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Update session data
      setSessionData(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 1,
        interactions: [...prev.interactions, {
          userMessage: input,
          botResponse: response.data.response,
          hierarchy,
          formality,
          context: response.data.detected_context,
          timestamp: new Date().toISOString()
        }]
      }));
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: 'Maaf, terjadi error. Coba lagi ya!', 
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setLoading(false);
    setInput('');
  };

  const rateResponse = async (messageId, rating, feedback = '') => {
    try {
      await axios.post('http://localhost:5000/api/rate', {
        messageId,
        rating,
        feedback,
        hierarchy,
        formality,
        sessionId: sessionData.startTime
      });

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, rating, feedback, needsRating: false }
          : msg
      ));

      // Update session data
      setSessionData(prev => ({
        ...prev,
        ratings: [...prev.ratings, { messageId, rating, feedback, timestamp: new Date().toISOString() }]
      }));

      setCurrentRating(null);
    } catch (error) {
      console.error('Rating error:', error);
    }
  };

  const exportSessionData = () => {
    const dataStr = JSON.stringify(sessionData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chatbot-session-${sessionData.startTime.split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const resetSession = () => {
    setMessages([{
      text: 'Halo! Saya chatbot kampus yang bisa membantu dengan berbagai informasi akademik, administrasi, dan fasilitas kampus. Ada yang bisa dibantu hari ini?',
      sender: 'bot',
      timestamp: new Date().toISOString()
    }]);
    setSessionData({
      startTime: new Date().toISOString(),
      totalMessages: 0,
      ratings: [],
      interactions: []
    });
  };

  const quickQuestions = [
    "Cara daftar ulang semester depan?",
    "Info beasiswa yang tersedia?", 
    "Jadwal perpustakaan buka tutup?",
    "Wifi kampus lemot banget!",
    "Makasih ya infonya sangat membantu"
  ];

  const averageRating = sessionData.ratings.length > 0 
    ? (sessionData.ratings.reduce((sum, r) => sum + r.rating, 0) / sessionData.ratings.length).toFixed(1)
    : 0;

  return (
    <div className="App">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <h2>🎓 Compassionate AI Chatbot - Research Demo</h2>
          <div className="header-controls">
            <button 
              className="analytics-toggle"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              📊 Analytics
            </button>
            <button onClick={resetSession} className="reset-btn">🔄 Reset</button>
            <button onClick={exportSessionData} className="export-btn">💾 Export Data</button>
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && (
          <div className="analytics-panel">
            <div className="analytics-grid">
              <div className="metric">
                <span className="metric-label">Total Messages:</span>
                <span className="metric-value">{sessionData.totalMessages}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Average Rating:</span>
                <span className="metric-value">{averageRating}/5 ⭐</span>
              </div>
              <div className="metric">
                <span className="metric-label">Session Duration:</span>
                <span className="metric-value">
                  {Math.round((new Date() - new Date(sessionData.startTime)) / 60000)} min
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Ratings Given:</span>
                <span className="metric-value">{sessionData.ratings.length}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Context Controls */}
        <div className="context-controls">
          <div className="control-group">
            <label>🏛️ Hierarchy Context:</label>
            <select value={hierarchy} onChange={(e) => setHierarchy(e.target.value)}>
              <option value="student-to-staff">👨‍🎓→👨‍💼 Mahasiswa → Staff Admin</option>
              <option value="student-to-dosen">👨‍🎓→👨‍🏫 Mahasiswa → Dosen</option>
              <option value="peer-to-peer">👨‍🎓→👨‍🎓 Sesama Mahasiswa</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>📝 Formality Level:</label>
            <select value={formality} onChange={(e) => setFormality(e.target.value)}>
              <option value="casual">😊 Casual/Santai</option>
              <option value="formal">🤝 Formal/Sopan</option>
            </select>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="quick-questions">
          <label>💡 Quick Test Questions:</label>
          <div className="questions-grid">
            {quickQuestions.map((q, index) => (
              <button 
                key={index}
                className="quick-question"
                onClick={() => setInput(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        
        {/* Messages */}
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-content">
                <div className="message-text">{msg.text}</div>
                
                {/* Bot message metadata */}
                {msg.sender === 'bot' && msg.metadata && (
                  <div className="message-metadata">
                    <span className="metadata-item">📋 Context: {msg.metadata.context}</span>
                    <span className="metadata-item">🏛️ Hierarchy: {msg.metadata.hierarchy}</span>
                    <span className="metadata-item">📝 Formality: {msg.metadata.formality}</span>
                    {msg.metadata.topic && (
                      <span className="metadata-item">📚 Topic: {msg.metadata.topic}</span>
                    )}
                    {msg.metadata.responseTime && (
                      <span className="metadata-item">⚡ Response: {msg.metadata.responseTime}ms</span>
                    )}
                  </div>
                )}

                {/* Rating system for bot messages */}
                {msg.sender === 'bot' && msg.needsRating && (
                  <div className="rating-section">
                    <div className="rating-prompt">Seberapa membantu response ini?</div>
                    <div className="rating-stars">
                      {[1,2,3,4,5].map(rating => (
                        <button
                          key={rating}
                          className={`star ${currentRating === msg.id ? 'active' : ''}`}
                          onClick={() => rateResponse(msg.id, rating)}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show rating if already rated */}
                {msg.sender === 'bot' && msg.rating && (
                  <div className="rated">
                    ✅ Rated: {msg.rating}/5 ⭐
                  </div>
                )}
              </div>
              
              <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="message-text">Sedang mengetik...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ketik pesan Anda... (contoh: cara daftar ulang, info beasiswa, dll)"
            disabled={loading}
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            className="send-button"
          >
            {loading ? '⏳' : '📤'} Kirim
          </button>
        </div>

        {/* Research Note */}
        <div className="research-note">
          <small>
            🔬 <strong>Research Mode:</strong> Data interaction sedang dikumpulkan untuk penelitian. 
            Semua rating dan feedback akan membantu improve sistem AI empati untuk konteks Indonesia.
          </small>
        </div>
      </div>
    </div>
  );
}

export default App;