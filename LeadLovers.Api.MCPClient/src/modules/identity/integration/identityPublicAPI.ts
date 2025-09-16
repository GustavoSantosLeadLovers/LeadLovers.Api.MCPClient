import { verify } from 'jsonwebtoken';

import logger from '@infra/logger/pinoLogger';
import { variables } from '@shared/configs/variables';
import {
	IdentitySessionApi,
	JWTPayload,
} from '@shared/integration/interfaces/identitySessionApi';

export class IdentityPublicAPI implements IdentitySessionApi {
	public validateJWTToken(token: string): JWTPayload {
		try {
			const { JWT_SECRET } = variables.auth;
			if (!JWT_SECRET) {
				logger.error('JWT secret not configured');
				throw new Error('Authentication configuration error');
			}
			const decoded = verify(token, JWT_SECRET) as {
				sub: string;
				email: string;
				name: string;
			};
			if (!decoded.sub || !decoded.email || !decoded.name) {
				throw new Error('Invalid token payload');
			}
			return {
				id: decoded.sub,
				email: decoded.email,
				name: decoded.name,
			};
		} catch (error) {
			logger.error(`JWT validation failed: ${error}`);
			throw new Error('Invalid or expired token');
		}
	}
}
