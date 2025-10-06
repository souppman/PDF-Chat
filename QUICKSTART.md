# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm run install:all
```

### Step 2: Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy the SQL from `supabase-schema.sql` (follows LangChain-standard schema)
3. Paste into Supabase SQL Editor and run it
4. Get your keys from Settings > API

**Note**: The schema uses the standard LangChain Supabase integration format with a single `documents` table containing `content`, `metadata`, and `embedding` columns.

### Step 3: Configure Backend

Create `backend/.env`:
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
DEEPSEEK_API_KEY=your-deepseek-key
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
FRONTEND_URL=http://localhost:3000
```

### Step 4: Configure Frontend

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 5: Set Up Embeddings

**Important**: Install embedding provider:

```bash
cd backend
npm install @langchain/openai
```

Add to `backend/.env`:
```env
OPENAI_API_KEY=your-openai-key
```

Update `backend/src/services/chatService.ts`:

```typescript
import { OpenAIEmbeddings } from '@langchain/openai';

// Add to class:
private embeddings: OpenAIEmbeddings;

// In constructor:
constructor() {
  // ... existing DeepSeek setup ...
  this.embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'text-embedding-3-small',
  });
}

// Replace the generateEmbedding method:
async generateEmbedding(text: string): Promise<number[]> {
  return await this.embeddings.embedQuery(text);
}
```

Update `backend/src/routes/pdfRoutes.ts` to uncomment the embedding code:

```typescript
// Uncomment these lines (around line 35-37):
const embeddings = await Promise.all(
  chunks.map(chunk => chatService.generateEmbedding(chunk))
);

// Uncomment this line (around line 41):
await vectorService.storeDocumentChunks(documentId, filename, chunks, embeddings);
```

### Step 6: Start the App

```bash
npm run dev
```

Open http://localhost:3000

## 🎯 Test It Out

1. Click "Upload PDF"
2. Select a PDF file
3. Wait for processing
4. Click on the document
5. Ask a question!

## 📋 Required API Keys

| Service | Get Key From | Purpose |
|---------|-------------|---------|
| DeepSeek | https://platform.deepseek.com | LLM for chat |
| OpenAI | https://platform.openai.com/api-keys | Embeddings |
| Supabase | Your Supabase project | Vector storage |

## ⚠️ Common Issues

**"Embedding generation not implemented"**
→ Complete Step 5 above

**CORS errors**
→ Check `FRONTEND_URL` in `backend/.env`

**Connection refused**
→ Make sure both servers are running with `npm run dev`

## 📚 Need More Help?

Check out:
- `README.md` - Full documentation
- `SETUP_CHECKLIST.md` - Detailed setup steps
- `docs/supabase.docs` - Supabase documentation links

