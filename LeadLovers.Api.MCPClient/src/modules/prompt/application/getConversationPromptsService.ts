export class GetConversationPromptsService {
	constructor() {}

	public async execute(
		userId: string,
		conversationId: string,
	): Promise<string> {
		// Simulate fetching prompts from a database or external service
		return `Prompts for user ${userId} in conversation ${conversationId}`;
	}
}
