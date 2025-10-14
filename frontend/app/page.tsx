'use client';

import { useState } from 'react';
import PDFUploader from '@/components/PDFUploader';
import ChatInterface from '@/components/ChatInterface';
import DocumentList from '@/components/DocumentList';

export default function Home() {
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showUploader, setShowUploader] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);

  const handleUploadSuccess = (documentId: string, filename: string) => {
    setSelectedDocument({ id: documentId, name: filename });
    setRefreshTrigger((prev) => prev + 1);
    setShowUploader(false);
  };

  const handleSelectDocument = (documentId: string, filename: string) => {
    setSelectedDocument({ id: documentId, name: filename });
    setShowDocuments(false);
  };

  const handleNewChat = () => {
    setSelectedDocument(null);
    setShowDocuments(false);
    setShowUploader(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] scanlines">
      {/* Main Content */}
      {!selectedDocument && !showUploader && !showDocuments ? (
        /* Landing Page - Severance Style */
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          {/* Logo */}
          <div className="mb-16 text-center">
            <h1 className="text-6xl font-bold text-[#89CFF0] pixel-glow mb-4">
              PDF AI
            </h1>
            <p className="text-[#5B9BD5] text-sm">RETRO EDITION v1.0</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-6 w-full max-w-md mb-16">
            <button
              onClick={() => setShowUploader(true)}
              className="px-12 py-6 bg-[#89CFF0] text-[#0a0e1a] border-2 border-[#89CFF0] text-sm font-bold pixel-button hover:bg-[#A7C7E7] hover:border-[#A7C7E7] transition-colors"
            >
              UPLOAD PDF
            </button>
            <button
              onClick={() => setShowDocuments(true)}
              className="px-12 py-6 bg-[#161b2e] border-2 border-[#89CFF0]/40 text-[#89CFF0] text-sm font-bold pixel-button hover:border-[#89CFF0]/70 hover:bg-[#89CFF0]/10 transition-colors"
            >
              MY DOCS
            </button>
          </div>

          {/* Footer */}
          <div className="text-[#5B9BD5] text-[8px]">
            <p>POWERED BY SUPABASE • LANGCHAIN • NEXT.JS</p>
          </div>
        </div>
      ) : showUploader ? (
        /* Upload View */
        <div className="min-h-screen flex flex-col">
          <header className="bg-[#0a0e1a] border-b border-[#89CFF0]/40 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                onClick={handleNewChat}
                className="text-[#89CFF0] hover:text-[#A7C7E7] text-xs"
              >
                BACK
              </button>
              <h1 className="text-[#89CFF0] text-sm pixel-glow">UPLOAD PDF</h1>
              <div className="w-20"></div>
            </div>
          </header>
          <div className="flex-1 flex items-center justify-center p-8">
            <PDFUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      ) : showDocuments ? (
        /* Documents View */
        <div className="min-h-screen flex flex-col">
          <header className="bg-[#0a0e1a] border-b border-[#89CFF0]/40 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                onClick={handleNewChat}
                className="text-[#89CFF0] hover:text-[#A7C7E7] text-xs"
              >
                BACK
              </button>
              <h1 className="text-[#89CFF0] text-sm pixel-glow">MY DOCUMENTS</h1>
              <div className="w-20"></div>
            </div>
          </header>
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <DocumentList
                onSelectDocument={handleSelectDocument}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Chat View */
        <div className="min-h-screen flex flex-col">
          <header className="bg-[#0a0e1a] border-b border-[#89CFF0]/40 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                onClick={handleNewChat}
                className="text-[#89CFF0] hover:text-[#A7C7E7] text-xs pixel-button"
              >
                NEW
              </button>
              <h1 className="text-[#89CFF0] text-xs pixel-glow truncate max-w-md">
                {selectedDocument?.name}
              </h1>
              <button
                onClick={() => setShowDocuments(true)}
                className="text-[#89CFF0] hover:text-[#A7C7E7] text-xs pixel-button"
              >
                DOCS
              </button>
            </div>
          </header>
          <div className="flex-1">
            <ChatInterface
              documentId={selectedDocument!.id}
              documentName={selectedDocument!.name}
            />
          </div>
        </div>
      )}
    </div>
  );
}
