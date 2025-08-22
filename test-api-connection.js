// Simple script to test API connection
// This script should be run in a browser console, not as a Node.js script

const testApiConnection = async () => {
  console.log('Testing API connection...');
  
  const baseURL = window.location.origin;
  const endpoints = [
    '/api/players/',
    '/api/players/search?q=messi',
    '/api/players/top-k?k=5'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const fullURL = baseURL + endpoint;
      console.log(`\nTesting: ${fullURL}`);
      const response = await fetch(fullURL);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success: Received ${Array.isArray(data) ? data.length : Object.keys(data).length} items`);
        if (Array.isArray(data) && data.length > 0) {
          console.log(`   First item: ${JSON.stringify(data[0]).substring(0, 100)}...`);
        }
      } else {
        console.log(`❌ Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.log(`   Details: ${errorText.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ Connection failed: ${error.message}`);
      console.log('   Make sure:');
      console.log('   1. The frontend development server is running');
      console.log('   2. The Django backend is running on port 8000');
      console.log('   3. The API proxy is properly configured');
    }
  }
};

// Export for browser use
window.testApiConnection = testApiConnection;
console.log('API test loaded. Run testApiConnection() in console to test endpoints.');
