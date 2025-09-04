#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";
import {createDbInstance} from "./infrastructure/migrate.ts"

await createDbInstance()

import "$std/dotenv/load.ts";

await dev(import.meta.url, "./web-main.ts", config);