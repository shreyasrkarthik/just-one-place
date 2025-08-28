#!/usr/bin/env node

// Test script to verify the Vercel API route works
import https from 'https';
import { URL } from 'url';

const VERCEL_APP_URL = process.argv[2] || 'https://just-one-place-mniia0yy2-personal-d7db0365.vercel.app';

console.log('🧪 Testing Production API Route');
console.log('🌐 App URL:', VERCEL_APP_URL);
console.log('');

// Test API route
const apiUrl = new URL('/api/foursquare/places/search', VERCEL_APP_URL);
apiUrl.searchParams.set('query', 'cafe');
apiUrl.searchParams.set('ll', '33.49,-112.03');
apiUrl.searchParams.set('radius', '10000');
apiUrl.searchParams.set('limit', '1');

console.log('📡 Testing API route:', apiUrl.toString());

const req = https.get(apiUrl.toString(), (res) => {
  console.log('📊 Response status:', res.statusCode);
  console.log('📋 Response headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', chunk => data += chunk);
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.results && json.results.length > 0) {
        console.log('✅ API Route Success!');
        console.log('📍 Found place:', json.results[0].name);
        console.log('🏢 Address:', json.results[0].location?.formatted_address);
        console.log('📏 Distance:', json.results[0].distance, 'meters');
      } else {
        console.log('⚠️ API returned no results');
        console.log('📄 Response:', JSON.stringify(json, null, 2));
      }
    } catch (error) {
      console.log('❌ Failed to parse JSON response');
      console.log('📄 Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request failed:', error.message);
  
  if (error.code === 'ENOTFOUND') {
    console.log('💡 Tip: Make sure your Vercel app URL is correct');
  } else if (error.code === 'ECONNREFUSED') {
    console.log('💡 Tip: The server might be down or the URL is incorrect');
  }
});

req.setTimeout(10000, () => {
  console.log('⏰ Request timed out after 10 seconds');
  req.destroy();
});

console.log('⏳ Waiting for response...');
console.log('');
console.log('Expected behavior:');
console.log('✅ Status: 200');
console.log('✅ CORS headers present');
console.log('✅ Results array with places');
console.log('✅ No CORS errors');
console.log('');
