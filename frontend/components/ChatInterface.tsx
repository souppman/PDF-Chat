'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, ChatMessage } from '@/lib/api';

interface ChatInterfaceProps {
  documentId: string;
}

export default function ChatInterface({ documentId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(inputMessage, documentId, messages);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message.toUpperCase() : 'FAILED TO SEND MESSAGE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#0a0e1a]">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center mt-16">
              <div className="inline-block p-8 border border-[#89CFF0]/40 bg-[#161b2e] pixel-border mb-4">
                <p className="text-[#89CFF0] text-sm mb-2">READY TO CHAT</p>
                <p className="text-[#5B9BD5] text-xs">ASK ME ANYTHING ABOUT YOUR PDF</p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] border px-5 py-4 ${
                  message.role === 'user'
                    ? 'bg-[#89CFF0] text-[#0a0e1a] border-[#89CFF0]'
                    : 'bg-[#161b2e] text-[#89CFF0] border-[#89CFF0]/40'
                } pixel-border-sm`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-[10px] opacity-70 uppercase font-bold">
                    {message.role === 'user' ? 'YOU' : 'AI'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <p
                  className={`text-[10px] mt-2 opacity-50`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#161b2e] border border-[#89CFF0]/40 px-5 py-4 pixel-border-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#89CFF0] animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#89CFF0] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#89CFF0] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-[#ff0000]/10 border border-[#ff0000]/50 pixel-border">
              <p className="text-sm text-[#ff0000]">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-[#0a0e1a] border-t border-[#89CFF0]/40 p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="TYPE YOUR QUESTION..."
              disabled={loading}
              className="flex-1 bg-[#161b2e] text-[#89CFF0] placeholder-[#5B9BD5] border border-[#89CFF0]/40 px-4 py-3 pixel-border-sm outline-none focus:border-[#89CFF0]/70 disabled:opacity-50 text-xs uppercase transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-6 py-3 bg-[#89CFF0] text-[#0a0e1a] border border-[#89CFF0] text-xs font-bold pixel-button hover:bg-[#A7C7E7] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
