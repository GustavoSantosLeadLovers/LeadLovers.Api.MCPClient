import { GetConversationIdService } from '@modules/prompt/application/getConversationIdService';
import { GetConversationPromptsService } from '@modules/prompt/application/getConversationPromptsService';
import { ProcessPromptService } from '@modules/prompt/application/processPromptService';
import { SetConversationIdService } from '@modules/prompt/application/setConversationIdService';
import { SetConversationPromptsService } from '@modules/prompt/application/setConversationPromptsService';

export interface ISendPromptServicesFactory {
	createGetConversationId(): GetConversationIdService;
	createGetConversationPrompts(): GetConversationPromptsService;
	createProcessPrompt(): ProcessPromptService;
	createSetConversationId(): SetConversationIdService;
	createSetConversationPrompts(): SetConversationPromptsService;
}
