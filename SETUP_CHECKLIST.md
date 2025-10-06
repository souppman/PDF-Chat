# Setup Checklist

Use this checklist to ensure your PDF AI Chat application is properly configured.

## ✅ Initial Setup

- [ ] Node.js (v18+) installed
- [ ] Dependencies installed (`npm run install:all`)

## ✅ Supabase Configuration

- [ ] Supabase project created
- [ ] SQL schema executed from `supabase-schema.sql`
- [ ] pgvector extension enabled
- [ ] Tables created: `documents`, `document_chunks`
- [ ] Function created: `match_document_chunks`
- [ ] Supabase URL obtained
- [ ] Supabase Service Key obtained (for backend)
- [ ] Supabase Anon Key obtained (for frontend)

## ✅ Backend Configuration

- [ ] `backend/.env` file created
- [ ] `PORT` set (default: 3001)
- [ ] `SUPABASE_URL` configured
- [ ] `SUPABASE_SERVICE_KEY` configured
- [ ] `DEEPSEEK_API_KEY` configured
- [ ] `DEEPSEEK_API_BASE` configured
- [ ] `FRONTEND_URL` configured (default: http://localhost:3000)

## ✅ Frontend Configuration

- [ ] `frontend/.env.local` file created
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configured
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured
- [ ] `NEXT_PUBLIC_API_URL` configured (default: http://localhost:3001)

## ✅ Embedding Configuration (Critical!)

- [ ] Embedding provider chosen (OpenAI, HuggingFace, etc.)
- [ ] Embedding package installed
- [ ] `generateEmbedding` method implemented in `backend/src/services/chatService.ts`
- [ ] API key for embedding service added to `backend/.env`
- [ ] Vector dimension in `supabase-schema.sql` matches embedding model
- [ ] Uncommented embedding code in `backend/src/routes/pdfRoutes.ts`

## ✅ API Keys Required

- [ ] DeepSeek API Key ([Get it here](https://platform.deepseek.com))
- [ ] Embedding API Key (e.g., OpenAI API Key)
- [ ] Supabase Keys (from your Supabase project)

## ✅ Testing

- [ ] Backend starts without errors (`npm run dev:backend`)
- [ ] Frontend starts without errors (`npm run dev:frontend`)
- [ ] Can access frontend at http://localhost:3000
- [ ] Can access backend at http://localhost:3001/health
- [ ] Can upload a PDF
- [ ] Can see uploaded documents in the list
- [ ] Can send chat messages
- [ ] Can receive AI responses
- [ ] Can delete documents

## 🔧 Common Issues

### Issue: "Missing Supabase environment variables"
**Solution**: Check that your `.env` files are properly configured with correct Supabase credentials.

### Issue: "Embedding generation not yet implemented"
**Solution**: You must implement the `generateEmbedding` method. See README.md step 4.

### Issue: "Failed to store document chunks"
**Solution**: 
1. Verify Supabase schema is set up correctly
2. Check that embedding dimension matches (default: 1536 for OpenAI)
3. Ensure pgvector extension is enabled

### Issue: CORS errors in browser
**Solution**: Make sure `FRONTEND_URL` in `backend/.env` matches your frontend URL.

### Issue: "Cannot find module '@langchain/openai'"
**Solution**: Install the embedding package: `cd backend && npm install @langchain/openai`

## 📝 Next Steps After Setup

1. Test with a sample PDF
2. Verify embeddings are being stored in Supabase
3. Test chat functionality
4. Customize chunking strategy if needed
5. Adjust AI temperature/parameters in `chatService.ts`
6. Customize UI/styling in frontend components

## 🎯 Quick Start Commands

```bash
# Install everything
npm run install:all

# Start both frontend and backend
npm run dev

# Or separately:
npm run dev:backend
npm run dev:frontend
```

---

**Need Help?** Check the README.md for detailed setup instructions and troubleshooting.

