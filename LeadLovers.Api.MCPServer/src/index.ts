import 'dotenv/config';

import { main } from './infra/mcp/server';

main().catch(error => process.stderr.write(`Main error: ${error}\n`));
