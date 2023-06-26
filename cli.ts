import { lslike } from './lslike.ts'
import { parse } from './deps.ts'

const args = parse(Deno.args)
lslike(args)
