import { Server } from 'http';
import { RedisClient } from '@shared/providers/Redis/redisClient';

export interface GracefulShutdownOptions {
	timeout?: number;
	signals?: NodeJS.Signals[];
}

export class GracefulShutdown {
	private server: Server | null = null;
	private isShuttingDown = false;
	private timeout: number;
	private signals: NodeJS.Signals[];

	constructor(options: GracefulShutdownOptions = {}) {
		this.timeout = options.timeout ?? 10000;
		this.signals = options.signals ?? ['SIGTERM', 'SIGINT'];
	}

	public setup(server: Server): void {
		this.server = server;
		this.setupSignalHandlers();
	}

	private setupSignalHandlers(): void {
		this.signals.forEach(signal => {
			process.on(signal, () => {
				console.log(
					`Received ${signal}, starting graceful shutdown...`,
				);
				this.shutdown();
			});
		});

		process.on('uncaughtException', error => {
			console.error('Uncaught Exception:', error);
			this.shutdown();
		});

		process.on('unhandledRejection', reason => {
			console.error('Unhandled Rejection:', reason);
			this.shutdown();
		});
	}

	private async shutdown(): Promise<void> {
		if (this.isShuttingDown) {
			return;
		}

		this.isShuttingDown = true;

		const shutdownTimeout = setTimeout(() => {
			console.log('Graceful shutdown timeout, forcing exit...');
			process.exit(1);
		}, this.timeout);

		try {
			if (this.server) {
				console.log('Closing HTTP server...');
				await new Promise<void>((resolve, reject) => {
					this.server!.close(err => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				});
				console.log('HTTP server closed successfully');
			}

			// Close Redis connections
			try {
				console.log('Closing Redis connections...');
				const redisClient = RedisClient.getInstance();
				await redisClient.disconnect();
				console.log('Redis connections closed successfully');
			} catch (redisError) {
				console.error('Error closing Redis connections:', redisError);
			}

			clearTimeout(shutdownTimeout);
			console.log('Graceful shutdown completed');
			process.exit(0);
		} catch (error) {
			console.error('Error during graceful shutdown:', error);
			clearTimeout(shutdownTimeout);
			process.exit(1);
		}
	}
}

export function createGracefulShutdown(
	options?: GracefulShutdownOptions,
): GracefulShutdown {
	return new GracefulShutdown(options);
}
