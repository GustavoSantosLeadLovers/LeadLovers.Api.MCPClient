import logger from '@infra/logger/pinoLogger';
import { ProcessPromptService } from '@modules/prompt/application/processPromptService';
import {
	sendPromptInput,
	SendPromptInput,
	SendPromptOutput,
} from '../dtos/sendPromptDTO';

export class SendPromptHandler {
	constructor(private readonly processPromptService: ProcessPromptService) {}

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
			const response = await this.processPromptService.execute(prompt);
			if (response.status === 'error') return response;
			return {
				status: 'success',
				result: {
					message: response.result,
					promptLength: prompt.length,
					userId: userId,
					processedAt: new Date().toISOString(),
				},
			};
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
