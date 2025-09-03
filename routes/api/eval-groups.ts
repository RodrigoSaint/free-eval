import { FreshContext } from "$fresh/server.ts";
import { DbEvalRepository } from "../../infrastructure/db-repository.ts";

export const handler = {
  async GET(_req: Request, _ctx: FreshContext): Promise<Response> {
    try {
      const repository = new DbEvalRepository();
      const evalGroups = await repository.getAllEvalGroups();

      return new Response(JSON.stringify(evalGroups), {
        headers: { "content-type": "application/json" },
      });
    } catch (error) {
      console.error('Error fetching eval groups:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  },
};