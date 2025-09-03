import { FreshContext } from "$fresh/server.ts";

interface EvalVersion {
  id: number;
  name: string;
  model: string;
  version: number;
  createdAt: string;
  avgScore: number;
  totalTests: number;
}

export const handler = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    try {
      const { name } = ctx.params;
      
      // Mock data for version history
      const mockData: EvalVersion[] = [
        {
          id: 3,
          name: decodeURIComponent(name),
          model: "gpt-4",
          version: 3,
          createdAt: "2024-01-15T10:30:00Z",
          avgScore: 0.85,
          totalTests: 2
        },
        {
          id: 2,
          name: decodeURIComponent(name),
          model: "gpt-4",
          version: 2,
          createdAt: "2024-01-14T08:15:00Z",
          avgScore: 0.75,
          totalTests: 2
        },
        {
          id: 1,
          name: decodeURIComponent(name),
          model: "gpt-4",
          version: 1,
          createdAt: "2024-01-13T16:20:00Z",
          avgScore: 0.65,
          totalTests: 2
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