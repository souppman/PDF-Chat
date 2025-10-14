# Deployment Guide

## Quick Deploy to Vercel

### Step 1: Deploy Frontend (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy Frontend:**
   ```bash
   cd frontend
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **pdf-chat** (or your choice)
   - In which directory is your code? **./frontend**
   - Want to override settings? **N**

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project on vercel.com
   - Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
     - `NEXT_PUBLIC_API_URL` = your backend URL (see Step 2)

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Step 2: Deploy Backend (Railway - FREE)

**Railway is perfect for the Express backend and has a generous free tier:**

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Deploy Backend:**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Add Environment Variables:**
   ```bash
   railway variables set SUPABASE_URL=your_supabase_url
   railway variables set SUPABASE_SERVICE_KEY=your_service_key
   railway variables set DEEPSEEK_API_KEY=your_deepseek_key
   railway variables set DEEPSEEK_API_BASE=https://api.deepseek.com/v1
   railway variables set HUGGINGFACE_API_KEY=your_hf_key
   railway variables set FRONTEND_URL=your_vercel_url
   railway variables set PORT=3005
   ```

5. **Get your Railway backend URL** and update Vercel's `NEXT_PUBLIC_API_URL`

---

## Alternative: Backend on Render (Also FREE)

1. Go to [render.com](https://render.com)
2. Create New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Name:** pdf-chat-backend
   - **Root Directory:** backend
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables in Render dashboard
6. Deploy
7. Copy the backend URL and update Vercel's `NEXT_PUBLIC_API_URL`

---

## Option 2: All-in-One Vercel Deployment (Convert Backend to API Routes)

If you want everything on Vercel, you need to convert the Express backend to Next.js API routes.

### Benefits:
- Single deployment
- Simpler management
- Free on Vercel

### Drawbacks:
- Requires code refactoring
- Serverless function limitations (10-second timeout on free tier)

Let me know if you want me to help convert the backend to Next.js API routes!

---

## Recommended Approach

**For easiest deployment:**
1. Frontend → Vercel (free, unlimited bandwidth)
2. Backend → Railway or Render (free tier available)

**Steps:**
1. Deploy frontend to Vercel
2. Deploy backend to Railway
3. Update `NEXT_PUBLIC_API_URL` in Vercel with Railway backend URL
4. Update `FRONTEND_URL` in Railway with Vercel frontend URL
5. Redeploy both

---

## Quick Commands

```bash
# Frontend (Vercel)
cd frontend
vercel --prod

# Backend (Railway)
cd backend
railway up
```

---

## Post-Deployment Checklist

- [ ] Frontend loads at Vercel URL
- [ ] Backend health check works: `https://your-backend.railway.app/health`
- [ ] CORS configured correctly (FRONTEND_URL matches Vercel URL)
- [ ] All environment variables set
- [ ] PDF upload works
- [ ] Chat functionality works
- [ ] Document deletion works

---

## Troubleshooting

**CORS Error:**
- Make sure `FRONTEND_URL` in backend matches your Vercel URL exactly

**Upload Fails:**
- Check Supabase keys are correct
- Verify Hugging Face API key is valid

**Chat Fails:**
- Verify DeepSeek API key has credits
- Check backend logs: `railway logs` or Render dashboard

---

## Monitoring

**Railway:**
```bash
railway logs
```

**Vercel:**
```bash
vercel logs
```

Or check dashboards at vercel.com and railway.app

