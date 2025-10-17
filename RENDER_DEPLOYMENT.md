# Deploying to Render

This guide covers deploying your PDF Chat application to Render with a traditional server-based backend (not serverless).

## Why Render?

- **Traditional Server**: Full Node.js server, not serverless functions
- **No Cold Starts**: Server stays warm
- **Better File Handling**: Proper support for file uploads and pdf-parse
- **Free Tier**: Generous free tier for testing
- **Easy Database**: Built-in PostgreSQL support

## Architecture

- **Backend**: Render Web Service (Node.js/Express)
- **Frontend**: Vercel (Next.js) OR Render Static Site
- **Database**: Supabase (already set up)

---

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to [https://dashboard.render.com/](https://dashboard.render.com/)
2. Sign up with GitHub (easiest for repo integration)

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `souppman/PDF-Chat`
3. Configure the service:

   **Basic Settings:**
   - **Name**: `pdfchat-backend` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   
   **Build & Deploy:**
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   
   **Instance Type:**
   - **Free** (or paid if you want better performance)

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** for each:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
DEEPSEEK_API_KEY=your_deepseek_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=10000
NODE_ENV=production
```

**Where to get these values:**
- **Supabase**: [https://app.supabase.com](https://app.supabase.com) → Your Project → Settings → API
  - `SUPABASE_URL`: Project URL
  - `SUPABASE_SERVICE_KEY`: service_role key (keep secret!)
  
- **DeepSeek**: [https://platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
  
- **Hugging Face**: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
  
- **FRONTEND_URL**: Your Vercel frontend URL (or leave blank for now)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-3 minutes)
3. Once deployed, you'll get a URL like: `https://pdfchat-backend.onrender.com`

### Step 5: Test Backend

Open your backend URL in browser:
```
https://pdfchat-backend.onrender.com/health
```

You should see:
```json
{
  "status": "ok",
  "message": "PDF Chat API is running"
}
```

---

## Part 2A: Deploy Frontend to Vercel (Recommended)

### Why Vercel for Frontend?

- Next.js optimized
- Automatic deployments
- Global CDN
- Free tier

### Steps:

1. Go to [https://vercel.com](https://vercel.com)
2. Import your repository
3. **Framework Preset**: Next.js
4. **Root Directory**: `frontend`
5. **Build Command**: `npm run build`
6. **Output Directory**: `.next`

### Environment Variables (Vercel):

Add these in Vercel dashboard → Your Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://pdfchat-backend.onrender.com
```

**Important:**
- Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not service key!)
- `NEXT_PUBLIC_API_URL` should be your Render backend URL

### Update Backend CORS:

Go back to Render → Your Backend Service → Environment → Add:

```
FRONTEND_URL=https://your-frontend.vercel.app
```

Then click **"Manual Deploy"** → **"Deploy latest commit"** to restart with new CORS settings.

---

## Part 2B: Deploy Frontend to Render (Alternative)

If you prefer to host everything on Render:

### Steps:

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect same repository
3. Configure:
   - **Name**: `pdfchat-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `frontend/.next`

4. Add Environment Variables (same as Vercel above)

5. Deploy!

---

## Troubleshooting

### Issue: 404 on API Calls

**Problem**: Frontend can't reach backend

**Solution**:
1. Check `NEXT_PUBLIC_API_URL` is set correctly in frontend env vars
2. Check CORS is configured in backend with correct `FRONTEND_URL`
3. Verify backend is running: visit `/health` endpoint

### Issue: Build Fails on Render

**Problem**: Backend build failing

**Solution**:
1. Check Build Command is: `npm install && npm run build`
2. Check Start Command is: `npm start`
3. Check Root Directory is set to `backend`
4. Review logs in Render Dashboard → Logs tab

### Issue: File Upload Fails

**Problem**: PDF upload timing out or failing

**Solution**:
1. Free tier has 512MB RAM - upgrade to paid if needed
2. Check Supabase credentials are correct
3. Check logs for specific error messages

### Issue: Cold Starts

**Problem**: First request after inactivity is slow

**Solution**:
- Free tier spins down after inactivity (15 min)
- Upgrade to paid tier for always-on service
- Or use a service like UptimeRobot to ping every 14 minutes

---

## Monitoring & Logs

### Render Logs:
1. Go to your service → **"Logs"** tab
2. See real-time logs
3. Filter by severity

### Metrics:
1. Go to your service → **"Metrics"** tab
2. See CPU, Memory, Response times
3. Identify performance issues

---

## Deployment Checklist

### Backend (Render):
- [ ] Web Service created
- [ ] Root directory set to `backend`
- [ ] Build/Start commands configured
- [ ] All environment variables added
- [ ] Deployed successfully
- [ ] `/health` endpoint returns 200 OK
- [ ] Backend URL copied for frontend

### Frontend (Vercel):
- [ ] Project imported
- [ ] Root directory set to `frontend`
- [ ] Framework preset: Next.js
- [ ] All environment variables added
- [ ] `NEXT_PUBLIC_API_URL` points to Render backend
- [ ] Deployed successfully
- [ ] Can access homepage

### Backend CORS Update:
- [ ] `FRONTEND_URL` set to frontend URL
- [ ] Backend redeployed with new env var
- [ ] Test API call from frontend works

---

## Cost Estimate

### Free Tier (for testing):

**Render Backend (Free)**:
- 512 MB RAM
- Spins down after 15 min inactivity
- 750 hours/month (plenty for testing)

**Vercel Frontend (Free)**:
- 100 GB bandwidth
- Unlimited sites
- Automatic HTTPS

**Supabase (Free)**:
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth

**Total: $0/month** for moderate use

### Paid Tier (for production):

**Render Backend (Starter - $7/month)**:
- Always-on
- Better performance
- More RAM

**Vercel (Pro - $20/month)**:
- More bandwidth
- Better analytics
- Priority support

**Total: ~$27/month** for production-ready app

---

## Next Steps

1. **Test Everything**: Upload a PDF, chat with it
2. **Monitor Logs**: Check for any errors
3. **Set Up Domain** (optional): Add custom domain in Render/Vercel
4. **Set Up Analytics** (optional): Add Google Analytics or Vercel Analytics
5. **Set Up Monitoring** (optional): UptimeRobot to prevent cold starts

---

## Support

- **Render Docs**: [https://render.com/docs](https://render.com/docs)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)

---

## Quick Deploy (Using render.yaml)

For fastest deployment, you can use the included `render.yaml`:

1. Push your code to GitHub
2. In Render Dashboard, click **"New +"** → **"Blueprint"**
3. Connect your repository
4. Render will auto-detect `render.yaml` and set up everything
5. Just add the environment variables when prompted
6. Deploy!

This will automatically configure your backend with all the right settings.

