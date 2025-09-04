#!/usr/bin/env -S deno run -A

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import {createDbInstance} from "./infrastructure/migrate.ts"

await createDbInstance()
await start(manifest, config);