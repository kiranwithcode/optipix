# Render Backend Deployment Guide

## Step-by-Step Instructions

### 1. Sign Up / Login to Render

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended) or email

### 2. Create New Web Service

1. Once logged in, click **"New +"** button
2. Select **"Web Service"**
3. Click **"Connect account"** to connect your GitHub account if not already connected
4. Select your repository: `kiranwithcode/optipix`

### 3. Configure Service

Fill in the following settings:

**Basic Settings:**
- **Name:** `optipix-backend` (or any name you prefer)
- **Region:** Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch:** `main`
- **Root Directory:** `backend` ⚠️ **IMPORTANT: Set this to `backend`**

**Build & Deploy:**
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Advanced Settings (Optional):**
- **Auto-Deploy:** `Yes` (deploys on every push to main)
- **Health Check Path:** `/health`

### 4. Environment Variables

Render will automatically set:
- `PORT` (you don't need to set this manually)
- `NODE_ENV=production`

No additional environment variables needed for basic setup.

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Watch the build logs in real-time
4. Wait for deployment to complete (usually 3-5 minutes)

### 6. Get Your Backend URL

1. Once deployed, you'll see your service dashboard
2. Your backend URL will be: `https://optipix-backend.onrender.com` (or similar)
3. Copy this URL

### 7. Update Frontend Environment Variable

1. Go to your Vercel dashboard (or frontend hosting)
2. Go to your project → **Settings** → **Environment Variables**
3. Add new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Render backend URL (e.g., `https://optipix-backend.onrender.com`)
4. **Redeploy** your frontend

### 8. Test Deployment

1. Test backend health: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"ok","message":"OptiPix Backend API is running"}`

2. Test from frontend:
   - Upload a video
   - Try compressing it
   - Should work if `VITE_API_URL` is set correctly

## Important Notes

### Render Free Tier Behavior

- **Spins down after 15 minutes of inactivity**
- **Takes 30-60 seconds to wake up** on first request after spin-down
- This is normal for free tier - first request will be slow
- Consider upgrading to paid plan for always-on service

### Custom Domain (Optional)

1. Go to **Settings** → **Custom Domains**
2. Add your domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure `backend/package.json` exists
- Verify Node.js version (Render uses latest LTS)

### Service Won't Start
- Check logs in Render dashboard
- Verify `npm start` command works locally
- Ensure PORT is set correctly (Render sets this automatically)

### CORS Errors
- Backend already has CORS enabled
- Make sure frontend URL is allowed (currently allows all origins)

### Video Compression Fails
- Check Render logs for FFmpeg errors
- Verify file size is under 500MB limit
- Check network tab in browser for API errors
- **Note:** First request after spin-down may timeout - retry

### Slow First Request
- This is normal on free tier (cold start)
- Service spins down after 15 min inactivity
- First request wakes it up (takes 30-60 seconds)
- Subsequent requests are fast

## Render Free Tier Limits

- **750 hours/month** of usage
- **Spins down after 15 minutes** of inactivity
- **512MB RAM**
- **0.1 CPU**
- Perfect for development and small projects

## Monitoring

- View logs in Render dashboard
- Check metrics in **Metrics** tab
- Set up alerts if needed
- View deployment history

## Upgrade to Paid Plan

If you need:
- Always-on service (no spin-down)
- More resources
- Better performance
- Custom domains with SSL

Go to **Settings** → **Plan** and upgrade.


