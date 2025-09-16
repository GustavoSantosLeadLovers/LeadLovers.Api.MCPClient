import {
	sendPromptInput,
	SendPromptInput,
	SendPromptOutput,
} from '../dtos/sendPromptDTO';
import logger from '@infra/logger/pinoLogger';

export class SendPromptHandler {
	public async handle(data: SendPromptInput): Promise<SendPromptOutput> {
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

		try {
			const result = {
				message: 'Prompt received and processed successfully',
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
