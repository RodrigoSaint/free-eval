import { FreshContext } from "$fresh/server.ts";
import { DbEvalRepository } from "../../../infrastructure/db-repository.ts";

export const handler = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    try {
      const fingerprint = ctx.params.fingerprint;
      
      if (!fingerprint) {
        return new Response(
          JSON.stringify({ error: "Fingerprint parameter is required" }),
          { status: 400, headers: { "content-type": "application/json" } }
        );
      }

      const repository = new DbEvalRepository();
      const scoreProgress = await repository.getScoreProgressByFingerprint(fingerprint);

      return new Response(JSON.stringify(scoreProgress), {
        headers: { "content-type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching score progress:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }
  },
};