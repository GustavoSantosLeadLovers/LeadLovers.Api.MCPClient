import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import logger from '@infra/logger/pinoLogger';
import {
	IdentitySessionApi,
	JWTPayload,
} from '@shared/integration/interfaces/identitySessionApi';

export interface AuthenticatedSocket extends Socket {
	data: Socket['data'] & {
		user?: JWTPayload;
	};
}

export class AuthMiddleware {
	constructor(private readonly identitySessionApi: IdentitySessionApi) {}

	public validateTokenJWT(
		socket: AuthenticatedSocket,
		next: (err?: ExtendedError) => void,
	): void {
		try {
			const token = this.extractToken(socket);
			if (!token) {
				logger.warn(
					`Connection attempt without token from ${socket.id}`,
				);
				return next(new Error('Authentication required'));
			}
			const user = this.identitySessionApi.validateJWTToken(token);
			socket.data.user = user;
			logger.info(
				`User ${user.email} authenticated on socket ${socket.id}`,
			);
			next();
		} catch (error) {
			logger.error(
				`Authentication failed for socket ${socket.id}: ${error}`,
			);
			next(new Error('Authentication failed'));
		}
	}

	private extractToken(socket: Socket): string | null {
		const authHeader = socket.handshake.auth?.token;
		if (authHeader) {
			return authHeader;
		}
		const authHeaderFromHeaders = socket.handshake.headers?.authorization;
		if (authHeaderFromHeaders?.startsWith('Bearer ')) {
			return authHeaderFromHeaders.substring(7);
		}
		const tokenFromQuery = socket.handshake.query?.token as
			| string
			| undefined;
		if (tokenFromQuery) {
			return tokenFromQuery;
		}
		return null;
	}
}
