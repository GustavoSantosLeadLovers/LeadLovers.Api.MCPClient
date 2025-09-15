import pino from 'pino';

import { variables } from '@shared/configs/variables';

const isDev = variables.server.NODE_ENV !== 'production';
const targets = [];
if (isDev) {
	targets.push({
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'SYS:standard',
			ignore: 'pid,hostname',
		},
		level: variables.logger.LOG_LEVEL,
	});
}
if (targets.length === 0) {
	const stdout = 1;
	targets.push({
		target: 'pino/file',
		options: { destination: stdout },
		level: variables.logger.LOG_LEVEL,
	});
}
const logger = pino({
	formatters: {
		log: object => {
			if (object.err) {
				const error = object.err as Error;
				object.stack = error.stack;
				object.message = error.message;
				Reflect.deleteProperty(object, 'err');
			}
			return object;
		},
	},
	timestamp: pino.stdTimeFunctions.isoTime,
	transport: {
		targets,
	},
});
export default logger;
