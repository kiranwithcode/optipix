# Deployment Status

## ✅ Backend - DEPLOYED

**Status:** Live and Running  
**URL:** https://optipix-backend.onrender.com  
**Platform:** Render  
**Health Check:** ✅ Working

### Test Backend
```bash
curl https://optipix-backend.onrender.com/health
```

Expected response:
```json
{"status":"ok","message":"OptiPix Backend API is running"}
```

## 📋 Next Steps - Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Add Environment Variable:**
   - Go to: **Settings** → **Environment Variables**
   - Add new variable:
     - **Name:** `VITE_API_URL`
     - **Value:** `https://optipix-backend.onrender.com`
   - Select: **Production**, **Preview**, and **Development**
   - Click **Save**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click **Redeploy** on latest deployment
   - Or push a new commit to trigger auto-deploy

### Option 2: Local Development

Create a `.env` file in the root directory:
```env
VITE_API_URL=https://optipix-backend.onrender.com
```

Then restart your dev server:
```bash
npm run dev
```

## 🧪 Testing

### Test Video Compression

1. Open your deployed frontend
2. Click on **"Video Compressor"** card
3. Upload a video file
4. Configure compression options
5. Click **"Compress Video"**
6. Wait for processing (may take 30-60 seconds on first request if Render service was sleeping)
7. Download compressed video

### Troubleshooting

**If video compression fails:**
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Check Render logs: https://dashboard.render.com
- First request after 15 min inactivity may timeout - retry

**CORS Errors:**
- Backend already has CORS enabled
- Should work out of the box

**Slow First Request:**
- Normal on Render free tier
- Service spins down after 15 min inactivity
- First request wakes it up (30-60 seconds)
- Subsequent requests are fast

## 📊 Backend Endpoints

- **Health:** `GET /health`
- **Compress Video:** `POST /api/compress-video`
- **Video Info:** `POST /api/video-info`

## 🔗 Links

- **Backend:** https://optipix-backend.onrender.com
- **Backend Health:** https://optipix-backend.onrender.com/health
- **Render Dashboard:** https://dashboard.render.com
- **GitHub Repo:** https://github.com/kiranwithcode/optipix

