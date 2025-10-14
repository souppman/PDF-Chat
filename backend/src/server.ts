import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pdfRoutes from './routes/pdfRoutes';
import chatRoutes from './routes/chatRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Allow both port 3000 and 3001 for local development
const allowedOrigins: string[] = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001'
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// JSON parsing for most routes
app.use('/api/chat', express.json());
app.use('/api/pdf/documents', express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PDF Chat API is running' });
});

// Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server (only in non-serverless environments)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 API endpoints:`);
    console.log(`   - POST   /api/pdf/upload`);
    console.log(`   - GET    /api/pdf/documents`);
    console.log(`   - DELETE /api/pdf/:documentId`);
    console.log(`   - POST   /api/chat`);
    console.log(`   - GET    /health`);
  });
}

// Export for Vercel serverless
export default app;

