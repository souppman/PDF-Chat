import { supabase } from '../config/supabase';
import { VectorSearchResult } from '../types';

export class VectorService {
  /**
   * Store document chunks with embeddings in Supabase
   * Following LangChain Supabase integration standard
   */
  async storeDocumentChunks(
    documentId: string,
    filename: string,
    chunks: string[],
    embeddings: number[][]
  ): Promise<void> {
    try {
      const documents = chunks.map((chunk, index) => ({
        content: chunk, // LangChain standard: Document.pageContent
        embedding: embeddings[index],
        metadata: {
          document_id: documentId,
          filename: filename,
          chunk_index: index,
          chunk_count: chunks.length,
          created_at: new Date().toISOString(),
        },
      }));

      const { error } = await supabase
        .from('documents')
        .insert(documents);

      if (error) {
        console.error('Error storing document chunks:', error);
        throw new Error('Failed to store document chunks');
      }
    } catch (error) {
      console.error('Error in storeDocumentChunks:', error);
      throw error;
    }
  }

  /**
   * Search for similar chunks using vector similarity
   * Uses LangChain standard match_documents function with metadata filtering
   */
  async searchSimilarChunks(
    queryEmbedding: number[],
    documentId: string,
    limit: number = 5
  ): Promise<VectorSearchResult[]> {
    try {
      // Use metadata filter to search within a specific document
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_count: limit,
        filter: { document_id: documentId }, // Filter by document_id in metadata
      });

      if (error) {
        console.error('Error searching similar chunks:', error);
        throw new Error('Failed to search similar chunks');
      }

      return (data || []).map((item: any) => ({
        content: item.content,
        similarity: item.similarity,
        metadata: item.metadata,
      }));
    } catch (error) {
      console.error('Error in searchSimilarChunks:', error);
      throw error;
    }
  }

  /**
   * Delete all chunks for a document using metadata filter
   */
  async deleteDocumentChunks(documentId: string): Promise<void> {
    try {
      // Delete all rows where metadata contains the document_id
      // Use ->> operator to extract text value from JSONB
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('metadata->>document_id', documentId);

      if (error) {
        console.error('Error deleting document chunks:', error);
        throw new Error('Failed to delete document chunks');
      }
    } catch (error) {
      console.error('Error in deleteDocumentChunks:', error);
      throw error;
    }
  }
}

export const vectorService = new VectorService();

