import { FreshContext } from "$fresh/server.ts";
import { DbEvalRepository } from "../../../infrastructure/db-repository.ts";

export const handler = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    try {
      const { name } = ctx.params;
      const decodedName = decodeURIComponent(name);
      const repository = new DbEvalRepository();
      
      const versions = await repository.getEvalVersions(decodedName);

      return new Response(JSON.stringify(versions), {
        headers: { "content-type": "application/json" },
      });
    } catch (error) {
      console.error('Error fetching eval versions:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  },
};