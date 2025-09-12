import 'dotenv/config';

import { ExpressApp } from './infra/http/server';

const app = new ExpressApp();
app.listen();
