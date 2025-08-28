// Vercel API route to proxy Foursquare Places API requests
// This avoids CORS issues in production

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the API key from environment variables
  const API_KEY = process.env.VITE_FOURSQUARE_API_KEY || 'XUNJF22RNH4EYNLLEQGMUZISBOYCXDSF1M0CAAVQJ0WEU4AW';
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'Foursquare API key not configured' });
  }

  try {
    // Build the Foursquare API URL with query parameters
    const queryParams = new URLSearchParams(req.query);
    const foursquareUrl = `https://places-api.foursquare.com/places/search?${queryParams.toString()}`;

    console.log('🔍 Proxying Foursquare request:', foursquareUrl.replace(API_KEY, 'API_KEY_HIDDEN'));

    // Make the request to Foursquare API
    const response = await fetch(foursquareUrl, {
      method: 'GET',
      headers: {
        'X-Places-Api-Version': '2025-06-17',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
        'User-Agent': 'VibePick/1.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Foursquare API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Foursquare API error', 
        details: errorText 
      });
    }

    const data = await response.json();
    
    console.log('✅ Foursquare API success:', {
      resultsCount: data.results?.length || 0,
      status: response.status
    });

    // Set CORS headers to allow requests from your domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Return the Foursquare data
    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch from Foursquare API', 
      details: error.message 
    });
  }
}
