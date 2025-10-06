import pdf from 'pdf-parse';
import { Buffer } from 'buffer';

export class PDFService {
  /**
   * Extract text content from a PDF buffer
   */
  async parsePDF(buffer: Buffer): Promise<string> {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF file');
    }
  }

  /**
   * Split text into chunks for vector storage
   * This is a simple chunking strategy - can be enhanced based on needs
   */
  chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + chunkSize, text.length);
      const chunk = text.slice(startIndex, endIndex);
      
      if (chunk.trim().length > 0) {
        chunks.push(chunk.trim());
      }

      startIndex += chunkSize - overlap;
    }

    return chunks;
  }

  /**
   * Clean and normalize extracted text
   * Removes null bytes and other characters that PostgreSQL TEXT fields can't handle
   */
  cleanText(text: string): string {
    return text
      .replace(/\u0000/g, '') // Remove null bytes (PostgreSQL can't store these in TEXT)
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '') // Remove other control characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .trim();
  }
}

export const pdfService = new PDFService();

