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
      
      // Mock data for now
      const mockData: EvalGroupDetails = {
        id: parseInt(groupId),
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
            evalGroupId: parseInt(groupId)
          },
          {
            id: 2,
            input: "Hellos",
            output: "Hellos World!",
            expected: "Hello World!",
            score: 0,
            inputFingerPrint: "def456",
            evalGroupId: parseInt(groupId)
          }
        ]
      };

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