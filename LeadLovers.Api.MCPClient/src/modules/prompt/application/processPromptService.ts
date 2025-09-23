import logger from '@infra/logger/pinoLogger';
import {
	IMCPClientProvider,
	MCPClientResult,
} from '@shared/providers/MCPClient/interfaces/mcpClientProvider';

export class ProcessPromptService {
	constructor(private readonly mcpClient: IMCPClientProvider) {}

	public async execute(prompt: string): Promise<MCPClientResult> {
		// await this.mcpClient.connectToServer('../server/build/index.js');
		await this.mcpClient.connectToServer(
			'../LeadLovers.Api.MCPServer/dist/server/index.js',
		);
		const result = await this.mcpClient.processQuery(prompt);
		logger.info(
			`Processed prompt: ${prompt} Result: ${JSON.stringify(result)}`,
		);
		return result;
	}
}
