export interface PDFDocument {
  id: string;
  filename: string;
  content: string;
  uploadedAt: Date;
  userId?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  documentId: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  sources?: string[];
}

export interface VectorSearchResult {
  content: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

