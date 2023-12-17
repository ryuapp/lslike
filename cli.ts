import { lslike } from "./lslike.ts";
import { parseArgs } from "./deps.ts";

const args = parseArgs(Deno.args);
lslike(args);
