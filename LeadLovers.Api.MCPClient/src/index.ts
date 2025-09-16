import 'dotenv/config';

import { ExpressApp } from './infra/http/server';
import { WebSocketServer } from './infra/web-socket/server';
import { createGracefulShutdown } from './shared/utils/gracefulShutdown';

const app = new ExpressApp();
const gracefulShutdown = createGracefulShutdown({
	timeout: 10000,
});
const server = app.listen();
const webSocketServer = new WebSocketServer(server);
webSocketServer.listen();
gracefulShutdown.setup(server);
