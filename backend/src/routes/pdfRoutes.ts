import express from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { pdfService } from '../services/pdfService';
import { vectorService } from '../services/vectorService';
import { chatService } from '../services/chatService';
import { supabase } from '../config/supabase';

const router = express.Router();

// Configure multer for file uploads (store in memory as buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

/**
 * POST /api/pdf/upload
 * Upload and process a PDF file
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    const pdfBuffer = req.file.buffer;
    const filename = req.file.originalname || 'document.pdf';

    // 1. Parse PDF
    const rawText = await pdfService.parsePDF(pdfBuffer);
    const cleanedText = pdfService.cleanText(rawText);

    // 2. Generate a unique document ID
    const documentId = randomUUID();

    // 3. Chunk the text
    const chunks = pdfService.chunkText(cleanedText);

    // 4. Generate embeddings for chunks
    const embeddings = await Promise.all(
      chunks.map(chunk => chatService.generateEmbedding(chunk))
    );

    // 5. Store chunks with embeddings in the documents table
    await vectorService.storeDocumentChunks(documentId, filename, chunks, embeddings);

    res.json({
      success: true,
      documentId: documentId,
      filename: filename,
      chunkCount: chunks.length,
      message: 'PDF uploaded and processed successfully!',
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Failed to upload and process PDF' });
  }
});

/**
 * GET /api/pdf/documents
 * Get list of all uploaded documents (grouped by document_id from metadata)
 */
router.get('/documents', async (req, res) => {
  try {
    // Query to get unique documents by grouping by metadata->document_id
    const { data: documents, error } = await supabase
      .from('documents')
      .select('metadata')
      .order('metadata->created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }

    // Group by document_id to get unique documents
    const uniqueDocs = new Map();
    documents?.forEach((doc: any) => {
      const docId = doc.metadata?.document_id;
      if (docId && !uniqueDocs.has(docId)) {
        uniqueDocs.set(docId, {
          id: docId,
          filename: doc.metadata.filename,
          uploaded_at: doc.metadata.created_at,
        });
      }
    });

    res.json({ documents: Array.from(uniqueDocs.values()) });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

/**
 * DELETE /api/pdf/:documentId
 * Delete a document and all its chunks
 */
router.delete('/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;

    // Delete all chunks for this document
    await vectorService.deleteDocumentChunks(documentId);

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;

