// Node.js script to test API connection
const https = require('https');
const http = require('http');

const testApiConnection = async () => {
  console.log('Testing FIFA API connection...\n');
  
  const baseURL = 'http://localhost:5173'; // Frontend dev server
  const endpoints = [
    '/api/players/',
    '/api/players/search?q=messi',
    '/api/players/top-k?k=5'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const fullURL = baseURL + endpoint;
      console.log(`Testing: ${fullURL}`);
      
      const protocol = fullURL.startsWith('https') ? https : http;
      
      const response = await new Promise((resolve, reject) => {
        const req = protocol.get(fullURL, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve({
              status: res.statusCode,
              statusText: res.statusMessage,
              data: data
            });
          });
        });
        
        req.on('error', (error) => {
          reject(error);
        });
        
        req.setTimeout(5000, () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });
      });
      
      if (response.status >= 200 && response.status < 300) {
        try {
          const jsonData = JSON.parse(response.data);
          console.log(`✅ Success: ${response.status} ${response.statusText}`);
          console.log(`   Received: ${Array.isArray(jsonData) ? jsonData.length + ' items' : 'JSON object'}`);
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            console.log(`   First item: ${JSON.stringify(jsonData[0]).substring(0, 100)}...`);
          }
        } catch (parseError) {
          console.log(`✅ Success: ${response.status} ${response.statusText}`);
          console.log(`   Response: ${response.data.substring(0, 200)}...`);
        }
      } else {
        console.log(`❌ Error: ${response.status} ${response.statusText}`);
        console.log(`   Response: ${response.data.substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`❌ Connection failed: ${error.message}`);
      console.log('   Make sure:');
      console.log('   1. The frontend development server is running on port 5173');
      console.log('   2. The Django backend is running on port 8000');
      console.log('   3. The API proxy is properly configured');
    }
    console.log('---');
  }
};

// Run the test
testApiConnection().catch(console.error);
