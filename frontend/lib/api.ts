// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export interface Document {
  id: string;
  filename: string;
  uploaded_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  sources?: string[];
}

/**
 * Upload a PDF file to the API route
 */
export async function uploadPDF(file: File): Promise<{ documentId: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/pdf/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload PDF');
  }

  return response.json();
}

/**
 * Get all uploaded documents
 */
export async function getDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_URL}/api/pdf/documents`);

  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  return response.json();
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/pdf/${documentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
}

/**
 * Send a chat message
 */
export async function sendChatMessage(
  message: string,
  documentId: string,
  conversationHistory?: ChatMessage[]
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      documentId,
      conversationHistory,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }

  return response.json();
}

