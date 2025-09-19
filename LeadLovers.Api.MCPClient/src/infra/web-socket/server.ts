import cors from 'cors';
import { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';

import { IdentityPublicAPI } from '@modules/identity/integration/identityPublicAPI';
import { ProcessPromptService } from '@modules/prompt/application/processPromptService';
import { SendPromptHandler } from '@modules/prompt/presentation/handlers/sendPromptHandler';
import { variables } from '@shared/configs/variables';
import { CacheKeys } from '@shared/enums/cacheKeys';
import { McpClientUsingOpenAIProvider } from '@shared/providers/MCPClient/implementations/mcpClientUsingOpenAIProvider';
import { RedisClient } from '@shared/providers/Redis/redisClient';
import logger from '../logger/pinoLogger';
import {
	AuthenticatedSocket,
	AuthMiddleware,
} from './middlewares/authMiddleware';

export class WebSocketServer {
	private io: Server;
	private readonly port: number = variables.server.PORT || 3001;
	private authMiddleware: AuthMiddleware;
	private redisClient: RedisClient = RedisClient.getInstance();
	private readonly CONNECTION_KEY_PREFIX = CacheKeys.CONNECTION;

	constructor(httpServer?: HttpServer) {
		const corsOptions = this.getCorsOptions();
		if (httpServer) {
			this.io = new Server(httpServer, {
				cors: corsOptions,
			});
		} else {
			this.io = new Server(this.port, {
				cors: corsOptions,
			});
		}
		this.initializeRedis();
		this.initializeAuthMiddleware();
		this.setupGlobalMiddlewares();
		this.setupEventHandlers();
	}

	private getCorsOptions(): cors.CorsOptions {
		const isDev = variables.server.NODE_ENV !== 'production';
		const domainUrl = variables.server.DOMAIN_URL;

		return {
			origin: isDev ? '*' : domainUrl.split(','),
			methods: ['GET', 'POST'],
			credentials: true,
		};
	}

	private async initializeRedis(): Promise<void> {
		try {
			await this.redisClient.connect();
			logger.info('Redis connected for WebSocket server');
		} catch (error) {
			logger.error(`Failed to connect to Redis: ${error}`);
			throw error;
		}
	}

	private initializeAuthMiddleware(): void {
		const identityPublicAPI = new IdentityPublicAPI();
		this.authMiddleware = new AuthMiddleware(identityPublicAPI);
	}

	private setupGlobalMiddlewares(): void {
		this.io.use(
			this.authMiddleware.validateTokenJWT.bind(this.authMiddleware),
		);
	}

	private async getUserConnection(userId: string): Promise<string | null> {
		const key = `${this.CONNECTION_KEY_PREFIX}${userId}`;
		return await this.redisClient.get(key);
	}

	private async storeUserConnection(
		userId: string,
		socketId: string,
	): Promise<void> {
		const key = `${this.CONNECTION_KEY_PREFIX}${userId}`;
		await this.redisClient.set(
			key,
			socketId,
			variables.redis.TTL.USER_CONNECTION,
		);
	}

	private async removeUserConnection(userId: string): Promise<void> {
		const key = `${this.CONNECTION_KEY_PREFIX}${userId}`;
		await this.redisClient.delete(key);
	}

	private async enforceUniqueConnection(
		userId: string,
		userEmail: string,
		newSocketId: string,
	): Promise<void> {
		const socketId = await this.getUserConnection(userId);
		if (!socketId) {
			await this.storeUserConnection(userId, newSocketId);
			return;
		}
		logger.info(
			`Disconnecting existing connection for user ${userEmail} (socket: ${socketId})`,
		);
		const socket = this.io.sockets.sockets.get(socketId);
		socket?.disconnect(true);
		await this.storeUserConnection(userId, newSocketId);
	}

	private async handleNewConnection(
		socket: AuthenticatedSocket,
	): Promise<void> {
		const userId = socket.data.user?.id;
		const userEmail = socket.data.user?.email || 'unknown';
		if (!userId) {
			logger.warn(
				`Unauthenticated connection attempt on socket ${socket.id}`,
			);
			socket.disconnect(true);
			return;
		}
		logger.info(`Client connected: ${socket.id}, user: ${userEmail}`);
		await this.enforceUniqueConnection(userId, userEmail, socket.id);
	}

	private setupEventHandlers(): void {
		this.io.on('connection', async (socket: AuthenticatedSocket) => {
			await this.handleNewConnection(socket);
			this.setupSocketEventListeners(socket);
		});
	}

	private setupSocketEventListeners(socket: AuthenticatedSocket): void {
		const userId = socket.data.user?.id;
		const userEmail = socket.data.user?.email || 'unknown';
		if (!userId) {
			logger.warn(
				`Unauthenticated connection attempt on socket ${socket.id}`,
			);
			socket.disconnect(true);
			return;
		}
		socket.on('disconnect', async reason => {
			await this.handleDisconnect(socket.id, userId, userEmail, reason);
		});
		socket.on('error', (error: unknown) => {
			this.handleSocketError(socket.id, userId, userEmail, error);
		});
		socket.on('send-prompt', async data => {
			await this.handlePromptRequest(socket, data);
		});
	}

	private async handleDisconnect(
		socketId: string,
		userId: string,
		userEmail: string,
		reason: string,
	): Promise<void> {
		logger.info(
			`Client disconnected: ${socketId}, userId: ${userId}, user: ${userEmail}, reason: ${reason}`,
		);
		await this.removeUserConnection(userId);
	}

	private async handleSocketError(
		socketId: string,
		userId: string,
		userEmail: string,
		error: unknown,
	): Promise<void> {
		logger.error(
			`Socket error for ${socketId}, user: ${userEmail}: ${error}`,
		);
		await this.removeUserConnection(userId);
	}

	private async handlePromptRequest(
		socket: AuthenticatedSocket,
		data: { prompt: string },
	): Promise<void> {
		if (!socket.data.user) {
			socket.emit('error', {
				message: 'Authentication required',
			});
			return;
		}
		const { user } = socket.data;
		logger.info(
			`Received prompt from user ${user.email}: ${data.prompt} on socket ${socket.id}`,
		);

		const mcpClient = new McpClientUsingOpenAIProvider();
		const processPromptService = new ProcessPromptService(mcpClient);
		const sendPromptHandler = new SendPromptHandler(processPromptService);
		const response = await sendPromptHandler.handle({
			prompt: data.prompt,
			userId: user.id,
			userEmail: user.email,
			userName: user.name,
		});
		socket.emit('prompt-response', response);
	}

	public listen(): void {
		logger.info(`WebSocket server running on port: ${this.port}`);
	}

	public getIO(): Server {
		return this.io;
	}

	public emit(event: string, data: unknown): void {
		this.io.emit(event, data);
	}

	public emitToRoom(room: string, event: string, data: unknown): void {
		this.io.to(room).emit(event, data);
	}
}
