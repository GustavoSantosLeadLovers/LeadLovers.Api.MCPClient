import { auth } from './auth';
import { logger } from './logger';
import { redis } from './redis';
import { server } from './server';

export const variables = {
	auth,
	logger,
	redis,
	server,
};
