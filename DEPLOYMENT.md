# Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
1. **Vercel Account**: Make sure you have a Vercel account
2. **Environment Variables**: Ensure API keys are configured
3. **Clean Build**: Clear any cached builds

### Step-by-Step Deployment

#### 1. Environment Variables in Vercel
Set these in your Vercel dashboard under Project Settings > Environment Variables:

```bash
VITE_FOURSQUARE_API_KEY=XUNJF22RNH4EYNLLEQGMUZISBOYCXDSF1M0CAAVQJ0WEU4AW
```

#### 2. Force New Deployment
Since we've made significant changes to the API configuration, you need to force a fresh deployment:

```bash
# Option A: Via Vercel CLI
vercel --prod --force

# Option B: Via Git (if connected to GitHub)
git add .
git commit -m "Fix CORS: Update to use API routes and 10km radius"
git push origin main
```

#### 3. Verify API Routes
After deployment, check that these endpoints work:

- `https://your-app.vercel.app/api/foursquare/places/search?query=cafe&ll=33.49,-112.03&radius=10000&limit=1`

### 🔧 Troubleshooting

#### Issue: Still getting CORS errors
**Cause**: Old build cache or environment variables not set
**Solution**: 
1. Clear Vercel build cache
2. Redeploy with `--force` flag
3. Check environment variables in Vercel dashboard

#### Issue: API route not found (404)
**Cause**: API route files not deployed properly
**Solution**: 
1. Ensure `api/foursquare/places/search.js` exists in your repository
2. Verify `vercel.json` is in the root directory
3. Redeploy

#### Issue: Still using 20km radius
**Cause**: Old JavaScript bundle cached
**Solution**:
1. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
2. Check browser developer tools for console logs
3. Verify the correct code is deployed

### 📊 Verification Checklist

After deployment, verify:

- [ ] ✅ No CORS errors in browser console
- [ ] ✅ API requests go to `/api/foursquare/places/search` (not direct Foursquare URLs)
- [ ] ✅ Search radius is 10km (10000 meters)
- [ ] ✅ Console logs show `isDirectApiCall: false`
- [ ] ✅ Places are returned successfully
- [ ] ✅ Fallback to mock data works if API fails

### 🛠️ Build Commands

```bash
# Development
npm run dev

# Production build (test locally)
npm run build
npm run preview

# Deploy to Vercel
vercel --prod
```

### 📁 Key Files for Deployment

Make sure these files are committed and deployed:

1. `api/foursquare/places/search.js` - Serverless API route
2. `vercel.json` - Vercel configuration
3. `src/utils/realPlacesService.ts` - Updated API configuration
4. Environment variables set in Vercel dashboard

### 🔍 Debug in Production

If issues persist, check the browser console for these debug logs:

```javascript
// Should show API route usage
🔑 API Configuration Status: {
  foursquareBaseUrl: "/api/foursquare/places",
  isProduction: true,
  // ...
}

// Should show API route calls
🔍 Foursquare API request: {
  baseUrl: "/api/foursquare/places",
  isDirectApiCall: false,
  // ...
}
```

If you see `isDirectApiCall: true` or URLs starting with `https://places-api.foursquare.com`, the old code is still being used and you need to force a fresh deployment.
