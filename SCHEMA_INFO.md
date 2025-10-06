# Database Schema Information

## ✅ LangChain-Standard Schema

This project uses the **official LangChain Supabase integration schema** as recommended in the Supabase documentation.

### Why This Schema?

Following the LangChain standard ensures:
- ✅ Full compatibility with LangChain's `SupabaseVectorStore`
- ✅ Easier integration with LangChain utilities
- ✅ Community-tested and well-documented approach
- ✅ Simpler schema with fewer tables to manage

## Schema Structure

### Documents Table

```sql
create table documents (
  id bigserial primary key,
  content text,              -- The chunk text (Document.pageContent in LangChain)
  metadata jsonb,            -- All metadata in JSON format
  embedding vector(1536)     -- Vector embedding for similarity search
);
```

### Metadata Structure

Each document chunk stores metadata in JSONB format:

```json
{
  "document_id": "uuid-here",      // Groups chunks from same PDF
  "filename": "example.pdf",        // Original filename
  "chunk_index": 0,                 // Position in document
  "chunk_count": 25,                // Total chunks in document
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Search Function

```sql
create function match_documents (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'       -- Filter by metadata (e.g., {"document_id": "uuid"})
)
```

## How It Works

### 1. Upload PDF
- Generate unique `document_id` (UUID)
- Parse and chunk PDF text
- Generate embeddings for each chunk
- Store chunks in `documents` table with metadata

### 2. Search Within Document
```typescript
// Filter by document_id in metadata
const results = await supabase.rpc('match_documents', {
  query_embedding: [0.1, 0.2, ...],
  match_count: 5,
  filter: { document_id: "your-uuid-here" }
});
```

### 3. List Documents
- Query `documents` table
- Group by `metadata->document_id`
- Extract unique documents with their filenames

### 4. Delete Document
- Delete all rows where `metadata->document_id` equals target ID
- All chunks are removed in one operation

## Benefits vs. Multi-Table Approach

**Single Table (Current - LangChain Standard):**
- ✅ Simpler schema
- ✅ Standard LangChain integration
- ✅ Easier to use with LangChain utilities
- ✅ Metadata-based filtering is flexible
- ✅ Community support and documentation

**Multi-Table (Alternative):**
- ❌ More complex joins
- ❌ Non-standard for LangChain
- ❌ Harder to integrate with LangChain tools
- ✅ Clearer separation of concerns
- ✅ Stricter data integrity

## Vector Dimension

Default: **1536** (OpenAI `text-embedding-3-small` or `text-embedding-ada-002`)

If using a different embedding model:
1. Update `vector(1536)` in `supabase-schema.sql`
2. Re-run the migration
3. No code changes needed (dimension is inferred from embeddings)

## Indexing

```sql
-- IVFFlat index for fast similarity search
create index documents_embedding_idx 
  on documents 
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
```

- Uses **cosine similarity** for vector comparison
- IVFFlat index optimized for ~100 lists (adjust for larger datasets)
- Provides fast approximate nearest neighbor search

## References

- [LangChain Supabase Integration](https://js.langchain.com/docs/integrations/vectorstores/supabase/)
- [Supabase AI Documentation](https://supabase.com/docs/guides/ai)
- [pgvector Documentation](https://github.com/pgvector/pgvector)

## Migration Notes

If you previously had a different schema:
1. Backup your data
2. Drop old tables if needed
3. Run the new `supabase-schema.sql`
4. Your backend code is already compatible with this schema

