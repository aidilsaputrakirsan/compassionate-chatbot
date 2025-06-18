// COMPREHENSIVE API TESTING SCRIPT FOR RESEARCH VALIDATION

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const SESSION_ID = `test-session-${Date.now()}`;

// Test scenarios for comprehensive validation
const testScenarios = [
  // HIERARCHY TESTING
  {
    category: 'Hierarchy Awareness',
    tests: [
      {
        message: 'Wifi lemot banget!',
        hierarchy: 'student-to-staff',
        formality: 'casual',
        expectedContext: 'complaint',
        description: 'Student complaint to staff (casual)'
      },
      {
        message: 'Wifi lemot banget!',
        hierarchy: 'student-to-dosen',
        formality: 'formal',
        expectedContext: 'complaint',
        description: 'Student complaint to professor (formal)'
      },
      {
        message: 'Wifi lemot banget!',
        hierarchy: 'peer-to-peer',
        formality: 'casual',
        expectedContext: 'complaint',
        description: 'Student complaint to peer (casual)'
      }
    ]
  },
  
  // CONTEXT DETECTION
  {
    category: 'Context Detection',
    tests: [
      {
        message: 'Terima kasih banyak infonya!',
        hierarchy: 'student-to-staff',
        formality: 'casual',
        expectedContext: 'praise',
        description: 'Praise detection test'
      },
      {
        message: 'Cara daftar ulang semester depan?',
        hierarchy: 'student-to-staff',
        formality: 'casual',
        expectedContext: 'inquiry',
        description: 'Inquiry detection test'
      },
      {
        message: 'Halo, selamat pagi!',
        hierarchy: 'student-to-dosen',
        formality: 'formal',
        expectedContext: 'greeting',
        description: 'Greeting detection test'
      }
    ]
  },
  
  // CAMPUS INFORMATION
  {
    category: 'Campus Information',
    tests: [
      {
        message: 'Info tentang beasiswa apa saja?',
        hierarchy: 'student-to-staff',
        formality: 'formal',
        expectedContext: 'inquiry',
        description: 'Scholarship information test'
      },
      {
        message: 'Jadwal perpustakaan buka tutup?',
        hierarchy: 'student-to-staff',
        formality: 'casual',
        expectedContext: 'inquiry',
        description: 'Library schedule test'
      },
      {
        message: 'Cara bayar SPP cicilan?',
        hierarchy: 'student-to-staff',
        formality: 'formal',
        expectedContext: 'inquiry',
        description: 'SPP payment information test'
      }
    ]
  },
  
  // CULTURAL SENSITIVITY
  {
    category: 'Cultural Sensitivity',
    tests: [
      {
        message: 'Maaf pak, ada masalah dengan sistem',
        hierarchy: 'student-to-dosen',
        formality: 'formal',
        expectedContext: 'complaint',
        description: 'Respectful complaint to professor'
      },
      {
        message: 'Thanks banget ya bro!',
        hierarchy: 'peer-to-peer',
        formality: 'casual',
        expectedContext: 'praise',
        description: 'Casual thanks to peer'
      }
    ]
  }
];

// Rating test data
const ratingTests = [
  { rating: 5, feedback: 'Sangat membantu dan sesuai budaya' },
  { rating: 4, feedback: 'Baik tapi bisa lebih natural' },
  { rating: 3, feedback: 'Cukup membantu' },
  { rating: 2, feedback: 'Kurang sesuai ekspektasi' },
  { rating: 1, feedback: 'Tidak membantu sama sekali' }
];

async function testAPI() {
  console.log('🧪 STARTING COMPREHENSIVE API TESTING');
  console.log('=' .repeat(50));
  
  let totalTests = 0;
  let passedTests = 0;
  let results = [];
  
  try {
    // Test server health
    console.log('\n📡 Testing server connection...');
    const healthResponse = await axios.get(`${BASE_URL}/api/test`);
    console.log('✅ Server connected:', healthResponse.data.message);
    
    // Run test scenarios
    for (const scenario of testScenarios) {
      console.log(`\n🎯 Testing: ${scenario.category}`);
      console.log('-'.repeat(30));
      
      for (const test of scenario.tests) {
        totalTests++;
        
        try {
          const response = await axios.post(`${BASE_URL}/api/chat`, {
            message: test.message,
            hierarchy: test.hierarchy,
            formality: test.formality,
            sessionId: SESSION_ID
          });
          
          const success = response.data.detected_context === test.expectedContext;
          if (success) passedTests++;
          
          results.push({
            category: scenario.category,
            test: test.description,
            input: test.message,
            expected: test.expectedContext,
            actual: response.data.detected_context,
            hierarchy: test.hierarchy,
            formality: test.formality,
            success,
            response: response.data.response.substring(0, 100) + '...'
          });
          
          console.log(`${success ? '✅' : '❌'} ${test.description}`);
          console.log(`   Input: "${test.message}"`);
          console.log(`   Expected Context: ${test.expectedContext}`);
          console.log(`   Actual Context: ${response.data.detected_context}`);
          console.log(`   Response: "${response.data.response.substring(0, 80)}..."`);
          
          // Test rating system
          if (success) {
            const rating = ratingTests[Math.floor(Math.random() * ratingTests.length)];
            await axios.post(`${BASE_URL}/api/rate`, {
              messageId: Date.now(),
              rating: rating.rating,
              feedback: rating.feedback,
              hierarchy: test.hierarchy,
              formality: test.formality,
              sessionId: SESSION_ID
            });
          }
          
        } catch (error) {
          console.log(`❌ ${test.description} - ERROR:`, error.message);
          results.push({
            category: scenario.category,
            test: test.description,
            success: false,
            error: error.message
          });
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Test analytics endpoint
    console.log('\n📊 Testing analytics endpoint...');
    try {
      const analyticsResponse = await axios.get(`${BASE_URL}/api/analytics`);
      console.log('✅ Analytics data retrieved');
      console.log(`   Total Messages: ${analyticsResponse.data.totalMessages}`);
      console.log(`   Average Rating: ${analyticsResponse.data.averageRating}`);
    } catch (error) {
      console.log('❌ Analytics test failed:', error.message);
    }
    
    // Test research summary
    console.log('\n🔬 Testing research summary endpoint...');
    try {
      const summaryResponse = await axios.get(`${BASE_URL}/api/research-summary`);
      console.log('✅ Research summary generated');
      console.log(`   Data Completeness: ${summaryResponse.data.dataQuality.completeness}`);
      console.log(`   Overall Rating: ${summaryResponse.data.insights.userSatisfaction.overallRating}`);
    } catch (error) {
      console.log('❌ Research summary test failed:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return;
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('🏁 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  // Print detailed results
  console.log('\n📋 DETAILED RESULTS:');
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.test}`);
    console.log(`   Category: ${result.category}`);
    console.log(`   Success: ${result.success ? '✅' : '❌'}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    } else {
      console.log(`   Expected: ${result.expected}, Got: ${result.actual}`);
      console.log(`   Context: ${result.hierarchy} | ${result.formality}`);
    }
  });
  
  console.log('\n🎉 Testing completed!');
}

// Export function for use in other scripts
module.exports = { testAPI, testScenarios };

// Run tests if called directly
if (require.main === module) {
  testAPI().catch(console.error);
}