import { variables } from '@shared/configs/variables';
import { createClient, RedisClientType } from 'redis';
import logger from '../../../infra/logger/pinoLogger';

export class RedisClient {
	private static instance: RedisClient;
	private client: RedisClientType;
	private isConnected = false;

	private constructor() {
		const redisUrl = variables.redis?.URL || 'redis://localhost:6379';

		this.client = createClient({
			url: redisUrl,
			socket: {
				reconnectStrategy: retries => {
					if (retries > 10) {
						logger.error(
							'Redis: Maximum reconnection attempts reached',
						);
						return new Error(
							'Maximum reconnection attempts reached',
						);
					}
					const delay = Math.min(retries * 100, 3000);
					logger.info(
						`Redis: Reconnecting in ${delay}ms (attempt ${retries})`,
					);
					return delay;
				},
			},
		});

		this.setupEventHandlers();
	}

	private setupEventHandlers(): void {
		this.client.on('connect', () => {
			logger.info('Redis: Connecting to server...');
		});

		this.client.on('ready', () => {
			this.isConnected = true;
			logger.info('Redis: Connected and ready');
		});

		this.client.on('error', error => {
			logger.error(`Redis error: ${error.message}`);
		});

		this.client.on('reconnecting', () => {
			logger.info('Redis: Reconnecting...');
		});

		this.client.on('end', () => {
			this.isConnected = false;
			logger.info('Redis: Connection closed');
		});
	}

	public static getInstance(): RedisClient {
		if (!RedisClient.instance) {
			RedisClient.instance = new RedisClient();
		}
		return RedisClient.instance;
	}

	public async connect(): Promise<void> {
		if (!this.isConnected) {
			await this.client.connect();
		}
	}

	public async disconnect(): Promise<void> {
		if (this.isConnected) {
			await this.client.quit();
		}
	}

	public getClient(): RedisClientType {
		if (!this.isConnected) {
			throw new Error('Redis client is not connected');
		}
		return this.client;
	}

	public async get(key: string): Promise<string | null> {
		return await this.client.get(key);
	}

	public async set(key: string, value: string, ttl?: number): Promise<void> {
		if (ttl) {
			await this.client.setEx(key, ttl, value);
		} else {
			await this.client.set(key, value);
		}
	}

	public async delete(key: string): Promise<void> {
		await this.client.del(key);
	}

	public async exists(key: string): Promise<boolean> {
		const result = await this.client.exists(key);
		return result === 1;
	}
}
