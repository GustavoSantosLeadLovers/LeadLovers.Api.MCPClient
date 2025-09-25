import logger from '@infra/logger/pinoLogger';
import { GetConversationIdService } from '@modules/prompt/application/getConversationIdService';
import { GetConversationPromptsService } from '@modules/prompt/application/getConversationPromptsService';
import { ProcessPromptService } from '@modules/prompt/application/processPromptService';
import { SetConversationIdService } from '@modules/prompt/application/setConversationIdService';
import { SetConversationPromptsService } from '@modules/prompt/application/setConversationPromptsService';
import {
	sendPromptInput,
	SendPromptInput,
	SendPromptOutput,
} from '../dtos/sendPromptDTO';

export class SendPromptHandler {
	constructor(
		private readonly services: {
			getConversationId: GetConversationIdService;
			getConversationPrompts: GetConversationPromptsService;
			processPrompt: ProcessPromptService;
			setConversationId: SetConversationIdService;
			setConversationPrompts: SetConversationPromptsService;
		},
	) {}

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
			let conversationId =
				await this.services.getConversationId.execute(userId);
			if (!conversationId) {
				conversationId =
					await this.services.setConversationId.execute(userId);
			}
			let prompts = await this.services.getConversationPrompts.execute(
				userId,
				conversationId,
			);
			prompts += `\n ${prompt}`;
			const response = await this.services.processPrompt.execute(prompts);
			await this.services.setConversationPrompts.execute(
				userId,
				conversationId,
				prompts,
			);
			return response;
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
