import logger from '@infra/logger/pinoLogger';

export class GetConversationPromptsService {
	constructor() {}

	public async execute(
		userId: string,
		conversationId: string,
	): Promise<string> {
		// Simulate fetching prompts from a database or external service
		logger.info(
			`Fetched prompts for user ID: ${userId} in conversation ID: ${conversationId}`,
		);
		return '';
	}
}
