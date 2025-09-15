import { sign } from 'jsonwebtoken';

import logger from '@infra/logger/pinoLogger';
import { variables } from '@shared/configs/variables';

type Payload = {
	token: string;
	email: string;
	name: string;
};

type Params = {
	id: string;
	email: string;
	name: string;
};

export class CreateSessionPayloadService {
	public async execute({ id, name, email }: Params): Promise<Payload> {
		const { JWT_SECRET } = variables.auth;
		if (!JWT_SECRET) {
			logger.error('Secret not provided');
			throw new Error('Secret not provided');
		}
		const token = sign({ name, email }, JWT_SECRET, {
			subject: id,
			expiresIn: '24Hrs',
		});
		return { token, email, name };
	}
}
