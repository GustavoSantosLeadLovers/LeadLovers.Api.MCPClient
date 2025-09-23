import logger from '@infra/logger/pinoLogger';
import { CacheKeys } from '@shared/enums/cacheKeys';
import { RedisClient } from '@shared/providers/Redis/redisClient';

export class GetConversationIdService {
	private redisClient: RedisClient = RedisClient.getInstance();
	private readonly CONVERSATION_KEY_PREFIX = CacheKeys.CONVERSATION;

	public async execute(userId: string): Promise<string | null> {
		try {
			await this.redisClient.connect();
			logger.info('Redis connected for GetConversationId service');
			const key = `${this.CONVERSATION_KEY_PREFIX}${userId}`;
			return await this.redisClient.get(key);
		} catch (error) {
			logger.error(`Failed to connect to Redis: ${error}`);
			throw error;
		} finally {
			await this.redisClient.disconnect();
		}
	}
}
