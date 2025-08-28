# CORS Solution for Production

## Problem
The Foursquare Places API doesn't allow direct browser requests due to CORS (Cross-Origin Resource Sharing) restrictions. This causes errors in production when trying to fetch place data directly from the browser.

## Solution
We've implemented a **Vercel API route** that acts as a proxy between the frontend and the Foursquare API.

### Architecture

```
Browser → Vercel API Route → Foursquare API
   ↑           ↓                    ↓
   ←     JSON Response      ← JSON Response
```

### Files Created

1. **`api/foursquare/places/search.js`** - Vercel serverless function that proxies requests
2. **`vercel.json`** - Configuration for Vercel deployment with CORS headers
3. **Updated `src/utils/realPlacesService.ts`** - Always uses API route (works in dev & prod)

### How It Works

#### Development Mode
- Vite dev server proxies `/api/foursquare/*` requests to the actual API
- No CORS issues because requests go through the dev server

#### Production Mode  
- Browser makes requests to `/api/foursquare/places/search`
- Vercel serverless function receives the request
- Function adds proper headers and forwards to Foursquare API
- Function returns the response with CORS headers set
- Browser receives the data without CORS errors

### Environment Variables

The API route needs the Foursquare API key. Set this in Vercel:

```bash
# In Vercel dashboard or CLI:
VITE_FOURSQUARE_API_KEY=your_api_key_here
```

### API Route Details

**Endpoint:** `GET /api/foursquare/places/search`

**Query Parameters:** (passed through to Foursquare API)
- `ll` - Latitude,longitude (e.g., "33.49,-112.03")  
- `radius` - Search radius in meters
- `query` - Search term (e.g., "cafe")
- `categories` - Category IDs
- `limit` - Max results (default 50)

**Example Request:**
```
GET /api/foursquare/places/search?query=cafe&ll=33.49,-112.03&radius=10000&limit=5
```

**Response:** Same as Foursquare API response format

### Security Features

1. **API Key Protection** - Key is stored server-side, never exposed to browser
2. **CORS Headers** - Proper headers set to allow frontend access  
3. **Error Handling** - Graceful error responses for API failures
4. **Rate Limiting** - Inherits Foursquare's rate limits

### Testing

✅ **Local Development:** Uses Vite proxy - works  
✅ **Production:** Uses Vercel API route - works  
✅ **CORS:** Proper headers set - no browser errors  
✅ **Authentication:** Server-side API key handling - secure  

### Deployment Notes

1. **Environment Variables:** Make sure `VITE_FOURSQUARE_API_KEY` is set in Vercel
2. **Function Timeout:** Set to 10 seconds in `vercel.json`  
3. **CORS Headers:** Configured globally for all `/api/*` routes
4. **Fallback:** App still falls back to mock data if API fails

This solution ensures the app works reliably in both development and production environments without CORS issues.
