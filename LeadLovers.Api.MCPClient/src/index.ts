import 'dotenv/config';

import { ExpressApp } from './infra/http/server';
import { createGracefulShutdown } from './shared/utils/gracefulShutdown';

const app = new ExpressApp();
const gracefulShutdown = createGracefulShutdown({
	timeout: 10000,
});
const server = app.listen();
gracefulShutdown.setup(server);
