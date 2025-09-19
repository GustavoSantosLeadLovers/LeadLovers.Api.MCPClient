import { GetConversationIdService } from '@modules/prompt/application/getConversationIdService';
import { GetConversationPromptsService } from '@modules/prompt/application/getConversationPromptsService';
import { ProcessPromptService } from '@modules/prompt/application/processPromptService';
import { SetConversationIdService } from '@modules/prompt/application/setConversationIdService';
import { SetConversationPromptsService } from '@modules/prompt/application/setConversationPromptsService';
import { McpClientUsingOpenAIProvider } from '@shared/providers/MCPClient/implementations/mcpClientUsingOpenAIProvider';
import { ISendPromptServicesFactory } from '../interfaces/sendPromptServicesFactory';

export class SendPromptsServiceFactoryUsingOpenAI
	implements ISendPromptServicesFactory
{
	public createGetConversationId() {
		return new GetConversationIdService();
	}

	public createGetConversationPrompts() {
		return new GetConversationPromptsService();
	}

	public createProcessPrompt() {
		const mcpClient = new McpClientUsingOpenAIProvider();
		return new ProcessPromptService(mcpClient);
	}

	public createSetConversationId() {
		return new SetConversationIdService();
	}

	public createSetConversationPrompts() {
		return new SetConversationPromptsService();
	}
}
