import OpenAI from "openai"
import type { OpenAIConfig } from "../types"
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { MockAIService } from "./mockAi"

export interface AIService {
  generateEmbeddings(texts: string[]): Promise<number[][]>
  generateChatCompletion(
    messages: ChatCompletionMessageParam[]
  ): AsyncGenerator<string, void, unknown>
}

export function createAIService(
  config: OpenAIConfig | undefined,
  useMockData: boolean = false
): AIService {
  if (useMockData) {
    return new MockAIService()
  }

  if (!config?.apiKey) {
    throw new Error("OpenAI API key is required when not using mock data")
  }

  const clientConfig: { apiKey: string; dangerouslyAllowBrowser: boolean; baseURL?: string } = {
    apiKey: config.apiKey,
    dangerouslyAllowBrowser: true,
  }

  // Support Azure OpenAI or other OpenAI-compatible APIs via custom baseURL
  if (config.baseURL) {
    clientConfig.baseURL = config.baseURL
  }

  const embeddingModel = config.embeddingModel || "text-embedding-3-small"
  const chatModel = config.chatModel || "gpt-4o-mini"

  const client = new OpenAI(clientConfig)

  return {
    async generateEmbeddings(texts: string[]): Promise<number[][]> {
      const response = await client.embeddings.create({
        input: texts,
        model: embeddingModel,
      })
      return response.data.map((item) => item.embedding)
    },

    async *generateChatCompletion(messages: ChatCompletionMessageParam[]) {
      const completion = await client.chat.completions.create({
        model: chatModel,
        messages,
        stream: true,
      })

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || ""
        if (content) yield content
      }
    },
  }
}
