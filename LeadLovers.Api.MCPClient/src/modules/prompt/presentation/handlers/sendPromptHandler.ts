import logger from '@infra/logger/pinoLogger';
import { McpClientUsingOpenAIProvider } from '@shared/providers/MCPClient/implementations/mcpClientUsingOpenAIProvider';
import { GetMachinesToolOutput } from '../../../../../../LeadLovers.Api.MCPServer/src/shared/types/getMachines';
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
			// await this.mcpClient.connectToServer('../server/build/index.js');
			await this.mcpClient.connectToServer(
				'../LeadLovers.Api.MCPServer/dist/server/index.js',
			);
			const response =
				await this.mcpClient.processQuery<GetMachinesToolOutput>(
					prompt,
				);
			if (response.status === 'error') {
				return response;
			}
			const result = {
				message: response.result,
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
