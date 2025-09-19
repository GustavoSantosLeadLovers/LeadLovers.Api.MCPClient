import cuid from 'cuid';

import logger from '@infra/logger/pinoLogger';
import { CacheKeys } from '@shared/enums/cacheKeys';
import { RedisClient } from '@shared/providers/Redis/redisClient';

export class SetConversationIdService {
	private redisClient: RedisClient = RedisClient.getInstance();
	private readonly CONVERSATION_KEY_PREFIX = CacheKeys.CONVERSATION;

	public async execute(userId: string): Promise<string> {
		try {
			await this.redisClient.connect();
			logger.info('Redis connected for GetConversationId service');
			const key = `${this.CONVERSATION_KEY_PREFIX}${userId}`;
			const conversationId = cuid();
			await this.redisClient.set(key, conversationId);
			return conversationId;
		} catch (error) {
			logger.error(`Failed to connect to Redis: ${error}`);
			throw error;
		} finally {
			await this.redisClient.disconnect();
		}
	}
}
