import logger from '@infra/logger/pinoLogger';

export class SetConversationPromptsService {
	constructor() {}

	public async execute(
		userId: string,
		conversationId: string,
		prompt: string,
	): Promise<void> {
		// Simulate fetching prompts from a database or external service
		logger.info(
			`Prompt processed and conversation updated for user ID: ${userId}`,
		);
		logger.info(
			`Prompts for user ${userId} in conversation ${conversationId} set to: ${prompt}`,
		);
	}
}
