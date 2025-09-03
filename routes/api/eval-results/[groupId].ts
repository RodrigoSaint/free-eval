import { FreshContext } from "$fresh/server.ts";
import { DbEvalRepository } from "../../../infrastructure/db-repository.ts";

interface EvalResult {
  id: number;
  input: string;
  output: string;
  expected: string;
  score: number;
  inputFingerPrint: string;
  evalGroupId: number;
}

interface EvalGroupDetails {
  id: number;
  name: string;
  model: string;
  version: number;
  createdAt: string;
  results: EvalResult[];
  avgScore: number;
  totalTests: number;
}

export const handler = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    try {
      const { groupId } = ctx.params;
      const id = parseInt(groupId);
      
      // Mock data with different content based on groupId
      const mockDataMap: Record<number, EvalGroupDetails> = {
        1: {
          id: 1,
          name: "My Eval",
          model: "gpt-4",
          version: 3,
          createdAt: "2024-01-15T10:30:00Z",
          avgScore: 0.85,
          totalTests: 2,
          results: [
            {
              id: 1,
              input: "Hello",
              output: "Hello World!",
              expected: "Hello World!",
              score: 1,
              inputFingerPrint: "abc123",
              evalGroupId: 1
            },
            {
              id: 2,
              input: "Hellos",
              output: "Hellos World!",
              expected: "Hello World!",
              score: 0,
              inputFingerPrint: "def456",
              evalGroupId: 1
            }
          ]
        },
        2: {
          id: 2,
          name: "Chat Evaluation",
          model: "gpt-3.5-turbo",
          version: 2,
          createdAt: "2024-01-14T15:45:00Z",
          avgScore: 0.72,
          totalTests: 3,
          results: [
            {
              id: 3,
              input: "What is AI?",
              output: "AI is artificial intelligence",
              expected: "AI stands for artificial intelligence",
              score: 0,
              inputFingerPrint: "xyz789",
              evalGroupId: 2
            },
            {
              id: 4,
              input: "How are you?",
              output: "I'm doing well",
              expected: "I'm doing well",
              score: 1,
              inputFingerPrint: "abc890",
              evalGroupId: 2
            },
            {
              id: 5,
              input: "What's the weather?",
              output: "I can't check weather",
              expected: "I don't have access to weather data",
              score: 1,
              inputFingerPrint: "def123",
              evalGroupId: 2
            }
          ]
        }
      };

      const mockData = mockDataMap[id] || mockDataMap[1];

      return new Response(JSON.stringify(mockData), {
        headers: { "content-type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  },
};