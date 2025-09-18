import logger from '@infra/logger/pinoLogger';
import { McpClientUsingOpenAIProvider } from '@shared/providers/MCPClient/implementations/mcpClientUsingOpenAIProvider';
import {
	sendPromptInput,
	SendPromptInput,
	SendPromptOutput,
} from '../dtos/sendPromptDTO';

export class SendPromptHandler {
	private readonly mcpClient = new McpClientUsingOpenAIProvider();

	public async handle(data: SendPromptInput): Promise<SendPromptOutput> {
		try {
			const input = sendPromptInput.safeParse(data);
			if (!input.success) {
				logger.error(
					`Invalid prompt input: ${JSON.stringify(input.error.format())}`,
				);
				return { status: 'error', result: input.error.format() };
			}

			const { prompt, userId, userEmail, userName } = input.data;

			logger.info(
				`Processing prompt for user: ${userName} (${userEmail}, ID: ${userId})`,
			);

			await this.mcpClient.connectToServer('../server/build/index.js');
			const message = await this.mcpClient.processQuery(prompt);

			const result = {
				message,
				promptLength: prompt.length,
				userId: userId,
				processedAt: new Date().toISOString(),
			};

			return { status: 'success', result };
		} catch (error) {
			logger.error(`Error processing prompt: ${error}`);
			return {
				status: 'error',
				result:
					error instanceof Error
						? error.message
						: 'Failed to process prompt',
			};
		}
	}
}
