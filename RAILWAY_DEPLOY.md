# Railway Backend Deployment Guide

## Step-by-Step Instructions

### 1. Sign Up / Login to Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with GitHub (recommended) or email

### 2. Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub if needed
4. Select your repository: `kiranwithcode/optipix`

### 3. Configure Service

1. Railway will create a service automatically
2. Click on the service to configure it
3. Go to **Settings** tab
4. Set **Root Directory** to: `backend`
5. Railway will auto-detect Node.js

### 4. Environment Variables (Optional)

Railway will automatically:
- Set `PORT` environment variable
- Provide the deployment URL

No additional environment variables needed for basic setup.

### 5. Deploy

1. Railway will automatically start building and deploying
2. Watch the build logs in the **Deployments** tab
3. Wait for deployment to complete (usually 2-3 minutes)

### 6. Get Your Backend URL

1. Once deployed, go to **Settings** tab
2. Scroll to **Networking** section
3. Click **"Generate Domain"** if not already generated
4. Copy the **Public Domain** URL (e.g., `https://optipix-backend-production.up.railway.app`)

### 7. Update Frontend Environment Variable

1. Go to your Vercel dashboard (or frontend hosting)
2. Go to your project → **Settings** → **Environment Variables**
3. Add new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Railway backend URL (e.g., `https://optipix-backend-production.up.railway.app`)
4. **Redeploy** your frontend

### 8. Test Deployment

1. Test backend health: `https://your-backend-url.railway.app/health`
   - Should return: `{"status":"ok","message":"OptiPix Backend API is running"}`

2. Test from frontend:
   - Upload a video
   - Try compressing it
   - Should work if `VITE_API_URL` is set correctly

## Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure `backend/package.json` exists
- Verify Node.js version (Railway auto-detects)

### Deployment Fails to Start
- Check logs in Railway dashboard
- Verify `npm start` command works locally
- Ensure PORT is set correctly (Railway sets this automatically)

### CORS Errors
- Backend already has CORS enabled
- Make sure frontend URL is allowed (currently allows all origins)

### Video Compression Fails
- Check Railway logs for FFmpeg errors
- Verify file size is under 500MB limit
- Check network tab in browser for API errors

## Railway Free Tier Limits

- **500 hours/month** of usage
- **$5 credit** per month
- Auto-sleeps after inactivity (wakes on request)
- Perfect for development and small projects

## Monitoring

- View logs in Railway dashboard
- Check metrics in **Metrics** tab
- Set up alerts if needed

## Custom Domain (Optional)

1. Go to **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Add your domain
4. Follow DNS configuration instructions


