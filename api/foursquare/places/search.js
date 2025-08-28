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

    // Proxying Foursquare request

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
      return res.status(response.status).json({ 
        error: 'Foursquare API error', 
        details: errorText 
      });
    }

    const data = await response.json();

    // Set CORS headers to allow requests from your domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Return the Foursquare data
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch from Foursquare API', 
      details: error.message 
    });
  }
}
