import { ChatOpenAI } from '@langchain/openai';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { ChatMessage, ChatRequest, ChatResponse } from '../types';
import { vectorService } from './vectorService';
import dotenv from 'dotenv';

dotenv.config();

export class ChatService {
  private llm: ChatOpenAI;
  private embeddings: HuggingFaceInferenceEmbeddings;

  constructor() {
    // Set OPENAI_API_KEY to DeepSeek key if not already set
    // (LangChain's OpenAI client checks this env var even when using custom baseURL)
    if (!process.env.OPENAI_API_KEY && process.env.DEEPSEEK_API_KEY) {
      process.env.OPENAI_API_KEY = process.env.DEEPSEEK_API_KEY;
    }

    // Initialize DeepSeek LLM using OpenAI-compatible API
    this.llm = new ChatOpenAI({
      modelName: 'deepseek-chat',
      openAIApiKey: process.env.DEEPSEEK_API_KEY,
      configuration: {
        baseURL: process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com/v1',
      },
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Initialize Hugging Face embeddings (DeepSeek doesn't provide embeddings API)
    // Using a high-quality, free embedding model from Hugging Face
    this.embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY || 'hf_' + process.env.DEEPSEEK_API_KEY, // Free tier available
      model: 'sentence-transformers/all-MiniLM-L6-v2', // 384 dimensions, fast and efficient
    });
  }

  /**
   * Generate embeddings for text using Hugging Face
   * Model: sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
   */
  async generateEmbedding(text: string): Promise<number[]> {
    return await this.embeddings.embedQuery(text);
  }

  /**
   * Chat with the PDF document using RAG (Retrieval Augmented Generation)
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      // 1. Generate embedding for user's question
      const questionEmbedding = await this.generateEmbedding(request.message);

      // 2. Search for relevant chunks from the document
      const relevantChunks = await vectorService.searchSimilarChunks(
        questionEmbedding,
        request.documentId,
        5
      );

      // 3. Build context from relevant chunks
      const context = relevantChunks
        .map((chunk, index) => `[Source ${index + 1}]:\n${chunk.content}`)
        .join('\n\n');

      // 4. Build conversation history
      const messages = [];

      // System message with context
      messages.push(
        new SystemMessage(
          `You are a helpful AI assistant that answers questions about PDF documents. 
          Use the following context from the document to answer the user's question. 
          If the answer cannot be found in the context, say so clearly.
          
          Context from document:
          ${context}`
        )
      );

      // Add conversation history if provided
      if (request.conversationHistory) {
        for (const msg of request.conversationHistory) {
          if (msg.role === 'user') {
            messages.push(new HumanMessage(msg.content));
          } else {
            messages.push(new AIMessage(msg.content));
          }
        }
      }

      // Add current user message
      messages.push(new HumanMessage(request.message));

      // 5. Get response from DeepSeek
      const response = await this.llm.invoke(messages);

      // 6. Return response with sources
      return {
        response: response.content as string,
        sources: relevantChunks.map((chunk) => chunk.content),
      };
    } catch (error) {
      console.error('Error in chat:', error);
      throw new Error('Failed to generate chat response');
    }
  }
}

export const chatService = new ChatService();

