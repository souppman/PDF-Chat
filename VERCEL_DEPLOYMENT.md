# Deploy to Vercel (Frontend + Backend)

This guide shows you how to deploy **both** the frontend and backend to Vercel's free tier.

## Overview

- **Frontend**: Next.js app (Vercel native)
- **Backend**: Express.js app as Vercel serverless functions
- **Cost**: FREE (Vercel Hobby plan)

---

## Prerequisites

1. [Vercel account](https://vercel.com/signup) (free)
2. GitHub repository with your code
3. API keys ready:
   - Supabase URL + Keys
   - DeepSeek API key
   - Hugging Face API key

---

## Part 1: Deploy Backend API

### Step 1: Create New Vercel Project for Backend

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Configure Project:**
   - **Project Name**: `pdfchat-backend` (or any name)
   - **Root Directory**: `backend` ← IMPORTANT!
   - **Framework Preset**: Other
   - **Build Command**: Leave default
   - **Output Directory**: Leave default

### Step 2: Add Backend Environment Variables

Click **Environment Variables** and add these:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
DEEPSEEK_API_KEY=sk-your-deepseek-key
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
HUGGINGFACE_API_KEY=hf_your-hugging-face-token
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Note**: You'll add the `FRONTEND_URL` after deploying the frontend (Step 4).

### Step 3: Deploy Backend

Click **Deploy**!

Vercel will:
- Build your TypeScript code
- Deploy it as serverless functions
- Give you a URL like: `https://pdfchat-backend.vercel.app`

**Copy this URL** - you'll need it for the frontend!

---

## Part 2: Deploy Frontend

### Step 1: Create New Vercel Project for Frontend

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the **same** GitHub repository
3. **Configure Project:**
   - **Project Name**: `pdfchat-frontend` (or any name)
   - **Root Directory**: `frontend` ← IMPORTANT!
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave default

### Step 2: Add Frontend Environment Variables

Click **Environment Variables** and add these:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=https://pdfchat-backend.vercel.app
```

**Important**: Replace `https://pdfchat-backend.vercel.app` with your actual backend URL from Part 1.

### Step 3: Deploy Frontend

Click **Deploy**!

Vercel will:
- Build your Next.js app
- Deploy it
- Give you a URL like: `https://pdfchat-frontend.vercel.app`

---

## Part 3: Connect Frontend to Backend

### Step 4: Update Backend CORS

Now that you have your frontend URL, go back to your **backend project** on Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add or update:
   ```
   FRONTEND_URL=https://your-actual-frontend-url.vercel.app
   ```
3. Click **Save**
4. Go to **Deployments** tab
5. Click **Redeploy** on the latest deployment

---

## ✅ You're Done!

Visit your frontend URL: `https://your-frontend-url.vercel.app`

You should see the retro Severance-style PDF AI Chat app!

---

## Testing Your Deployment

1. **Upload a PDF**: Click "UPLOAD PDF" and select a file
2. **Chat**: Ask questions about your document
3. **Check Logs**: If something fails:
   - **Backend logs**: Vercel dashboard → Backend project → Deployments → Click deployment → View Function Logs
   - **Frontend logs**: Vercel dashboard → Frontend project → Deployments → Click deployment → View Function Logs

---

## Troubleshooting

### Backend Issues

**Problem**: 500 errors or "Failed to upload PDF"

**Solution**: Check backend environment variables:
```bash
# All 5 variables must be set:
SUPABASE_URL
SUPABASE_SERVICE_KEY
DEEPSEEK_API_KEY
DEEPSEEK_API_BASE
HUGGINGFACE_API_KEY
```

**Problem**: CORS errors in browser console

**Solution**: Make sure `FRONTEND_URL` in backend matches your actual frontend URL (no trailing slash).

### Frontend Issues

**Problem**: "Failed to fetch" errors

**Solution**: Check frontend environment variables:
```bash
# Make sure NEXT_PUBLIC_API_URL points to your backend:
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

**Problem**: Supabase connection errors

**Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct.

---

## Auto-Deploy on Git Push

Both deployments will automatically redeploy when you push to `main` branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will rebuild and redeploy both projects automatically! 🎉

---

## Cost Breakdown

**Vercel Hobby (Free) Tier Limits:**
- ✅ 100 GB bandwidth/month
- ✅ Serverless function execution
- ✅ Unlimited deployments
- ✅ Custom domains
- ⚠️ 10-second function timeout (use 60s with Pro if needed)

**Other Services:**
- ✅ Supabase: Free tier (500 MB database, 2 GB bandwidth)
- ✅ DeepSeek: Pay-as-you-go (very cheap ~$0.14/1M tokens)
- ✅ Hugging Face: Free tier available

**Total Cost**: $0 for moderate usage! 💰

---

## Next Steps

- **Custom Domain**: Add your own domain in Vercel project settings
- **Analytics**: Enable Vercel Analytics for free
- **Monitoring**: Set up error tracking with Sentry (optional)

Enjoy your deployed PDF AI Chat app! 🚀

