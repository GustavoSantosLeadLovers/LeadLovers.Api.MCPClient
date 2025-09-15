import cors from 'cors';
import { Server as HttpServer } from 'node:http';
import { Server, Socket } from 'socket.io';

import { SendPromptHandler } from '@modules/prompt/presentation/handlers/sendPromptHandler';
import { variables } from '@shared/configs/variables';
import logger from '../logger/pinoLogger';

export class WebSocketServer {
	private io: Server;
	private readonly port: number = variables.server.PORT || 3001;

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

	private setupEventHandlers(): void {
		this.io.on('connection', (socket: Socket) => {
			logger.info(`Client connected: ${socket.id}`);

			socket.on('disconnect', reason => {
				logger.info(
					`Client disconnected: ${socket.id}, reason: ${reason}`,
				);
			});

			socket.on('error', (error: unknown) => {
				logger.error(`Socket error for ${socket.id}: ${error}`);
			});

			socket.on('send-prompt', async data => {
				logger.info(
					`Received prompt from ${socket.id}: ${data.prompt}`,
				);
				const sendPromptHandler = new SendPromptHandler();
				const response = await sendPromptHandler.handle(data.prompt);
				socket.emit('prompt-response', response);
			});
		});
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
