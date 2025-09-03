import { FreshContext } from "$fresh/server.ts";
import { DbEvalRepository } from "../../infrastructure/db-repository.ts";

interface EvalGroupWithLatestRun {
  id: number;
  name: string;
  model: string;
  latestVersion: number;
  totalRuns: number;
  lastRunAt: string;
  avgScore: number;
}

export const handler = {
  async GET(_req: Request, _ctx: FreshContext): Promise<Response> {
    try {
      const repository = new DbEvalRepository();
      
      // This would need to be implemented in the repository
      // For now, return mock data
      const mockData: EvalGroupWithLatestRun[] = [
        {
          id: 1,
          name: "My Eval",
          model: "gpt-4",
          latestVersion: 3,
          totalRuns: 15,
          lastRunAt: "2024-01-15T10:30:00Z",
          avgScore: 0.85
        },
        {
          id: 2,
          name: "Chat Evaluation",
          model: "gpt-3.5-turbo",
          latestVersion: 2,
          totalRuns: 8,
          lastRunAt: "2024-01-14T15:45:00Z",
          avgScore: 0.72
        }
      ];

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