'use client';

import { useState, useEffect } from 'react';
import { getDocuments, deleteDocument, Document } from '@/lib/api';

interface DocumentListProps {
  onSelectDocument: (documentId: string, filename: string) => void;
  refreshTrigger?: number;
}

export default function DocumentList({ onSelectDocument, refreshTrigger }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message.toUpperCase() : 'FAILED TO LOAD DOCUMENTS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const handleDelete = async (documentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('DELETE THIS DOCUMENT?')) {
      return;
    }

    try {
      await deleteDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (err) {
      alert(err instanceof Error ? err.message.toUpperCase() : 'FAILED TO DELETE DOCUMENT');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex gap-2 mb-4">
          <div className="w-4 h-4 bg-[#89CFF0] animate-pulse"></div>
          <div className="w-4 h-4 bg-[#89CFF0] animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-4 h-4 bg-[#89CFF0] animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
        <p className="text-[#5B9BD5] text-xs">LOADING...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#ff0000]/10 border border-[#ff0000]/50 pixel-border">
        <p className="text-[10px] text-[#ff0000]">{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block p-8 border border-[#89CFF0]/40 bg-[#161b2e] pixel-border">
          <p className="text-[#89CFF0] text-xs">NO DOCUMENTS YET</p>
          <p className="text-[#5B9BD5] text-[8px] mt-2">UPLOAD YOUR FIRST PDF</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelectDocument(doc.id, doc.filename)}
          className="relative bg-[#161b2e] border border-[#89CFF0]/40 p-4 pixel-border cursor-pointer hover:border-[#89CFF0]/70 hover:bg-[#89CFF0]/10 transition-all pixel-button group"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[#89CFF0] text-[10px] font-bold truncate mb-2 group-hover:text-white">
                {doc.filename}
              </p>
              <p className="text-[#5B9BD5] text-[8px]">
                {new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).replace(/\//g, '-')}
              </p>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={(e) => handleDelete(doc.id, e)}
            className="absolute top-2 right-2 p-2 bg-[#161b2e] border border-[#ff0000]/50 text-[#ff0000] hover:bg-[#ff0000]/20 hover:border-[#ff0000]/80 transition-colors text-xs opacity-0 group-hover:opacity-100"
            title="DELETE"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
