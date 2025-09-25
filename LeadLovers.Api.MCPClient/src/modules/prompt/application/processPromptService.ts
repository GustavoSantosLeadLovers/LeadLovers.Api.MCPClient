import logger from '@infra/logger/pinoLogger';
import { variables } from '@shared/configs/variables';
import {
	IMCPClientProvider,
	MCPClientResult,
} from '@shared/providers/MCPClient/interfaces/mcpClientProvider';

export class ProcessPromptService {
	constructor(private readonly mcpClient: IMCPClientProvider) {}

	public async execute(prompt: string): Promise<MCPClientResult> {
		await this.mcpClient.connectToServer(variables.mcpServer.PATH);
		const result = await this.mcpClient.processQuery(prompt);
		logger.info(
			`Processed prompt: ${prompt} Result: ${JSON.stringify(result)}`,
		);
		return result;
	}
}
