import { FreshContext } from "$fresh/server.ts";
import { DbEvalRepository } from "../../../infrastructure/eval.ts";

export const handler = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    try {
      const { name } = ctx.params;
      const decodedName = decodeURIComponent(name);
      const repository = new DbEvalRepository();
      
      const chartData = await repository.getEvalHistoryChart(decodedName);

      return new Response(JSON.stringify(chartData), {
        headers: { "content-type": "application/json" },
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  },
};