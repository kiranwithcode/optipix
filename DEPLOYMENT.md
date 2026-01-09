# Deployment Guide

## Overview

OptiPix has two parts that need deployment:
1. **Frontend** - React app (static site)
2. **Backend** - Node.js API server (required for video compression)

## Frontend Deployment

### Vercel (Recommended - Already Configured)

Your project is already set up for Vercel deployment:

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Vite and deploy
   - Add environment variable: `VITE_API_URL` = your backend URL

### Other Frontend Options
- **Netlify** - Similar to Vercel
- **GitHub Pages** - Free static hosting
- **Cloudflare Pages** - Fast CDN

## Backend Deployment

**YES, the backend MUST be deployed** for video compression to work in production.

### Option 1: Railway (Recommended - Easy & Free)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `/backend`
6. Railway auto-detects Node.js and deploys
7. Copy the deployment URL
8. Update frontend `VITE_API_URL` environment variable

**Railway provides:**
- Free tier (500 hours/month)
- Automatic HTTPS
- Environment variables
- Easy scaling

### Option 2: Render (Free Tier Available)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Add environment variables if needed
7. Deploy and copy the URL

**Render provides:**
- Free tier (spins down after inactivity)
- Automatic HTTPS
- Easy setup

### Option 3: Fly.io (Good for Global Distribution)

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. In backend directory: `fly launch`
3. Follow prompts
4. Deploy: `fly deploy`

### Option 4: Vercel Serverless Functions

Convert backend to Vercel serverless functions:

1. Create `api/` folder in root
2. Convert Express routes to serverless functions
3. Deploy both frontend and backend together

**Note:** FFmpeg in serverless can be complex due to binary size.

### Option 5: DigitalOcean App Platform / Heroku

- Paid options with more resources
- Good for production workloads

## Environment Variables

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (Railway/Render/etc.)
```
PORT=3001 (usually auto-set)
```

## Quick Deployment Steps

1. **Deploy Backend First:**
   ```bash
   # Push code
   git push origin main
   
   # Deploy to Railway/Render
   # Copy backend URL
   ```

2. **Update Frontend Environment:**
   - In Vercel dashboard
   - Add `VITE_API_URL` = your backend URL
   - Redeploy frontend

3. **Test:**
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-backend.railway.app/health`

## Important Notes

- **Backend is required** for video compression feature
- Image compression works without backend (client-side)
- Make sure CORS is enabled in backend (already configured)
- Backend needs FFmpeg binary (handled by `ffmpeg-static` package)
- File upload limits: 500MB per video (adjust in backend if needed)

## Troubleshooting

### Backend not responding
- Check backend logs in Railway/Render dashboard
- Verify `VITE_API_URL` is set correctly in frontend
- Check CORS settings in backend

### Video compression fails
- Verify backend is running and accessible
- Check backend logs for FFmpeg errors
- Ensure file size is under 500MB limit

