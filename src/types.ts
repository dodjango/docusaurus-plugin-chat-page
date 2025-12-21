export interface FileNode {
  type: "file" | "directory"
  name: string
  path: string
  children?: FileNode[]
  content?: {
    metadata: Record<string, any>
    rawContent: string
  }
}

/**
 * Base document chunk without embedding
 */
export interface DocumentChunk {
  text: string
  metadata: {
    filePath: string
    title?: string
    section?: string
    position?: number
    [key: string]: any
  }
}

/**
 * Document chunk with embedding vector
 */
export interface DocumentChunkWithEmbedding extends DocumentChunk {
  embedding: number[]
}

export interface VectorStore {
  chunks: DocumentChunkWithEmbedding[]
  metadata: {
    model: string
    timestamp: string
    version: string
  }
}

export interface ChatPluginContent {
  chunks: DocumentChunkWithEmbedding[]
  metadata: {
    totalChunks: number
    lastUpdated: string
  }
}

export interface OpenAIConfig {
  apiKey: string
  /** Custom base URL for Azure OpenAI or other OpenAI-compatible APIs */
  baseURL?: string
  /** Embedding model to use (default: text-embedding-3-small) */
  embeddingModel?: string
  /** Chat model to use (default: gpt-4o-mini) */
  chatModel?: string
}

export interface DevelopmentConfig {
  mockData: boolean
}

export interface PluginOptions {
  label?: string
  path?: string
  openai?: OpenAIConfig
  development?: DevelopmentConfig
}
