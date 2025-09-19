import { Anthropic } from '@anthropic-ai/sdk';
import {
	MessageParam,
	Tool,
} from '@anthropic-ai/sdk/resources/messages/messages.mjs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

import { variables } from '@shared/configs/variables';
import { IMCPClientProvider } from '../interfaces/mcpClientProvider';

export class McpClientUsingAnthropicProvider implements IMCPClientProvider {
	private mcp: Client;
	private transport: StdioClientTransport | null = null;
	private anthropic: Anthropic;
	private tools: Tool[] = [];

	constructor() {
		if (!variables.ai.ANTHROPIC_API_KEY) {
			throw new Error('ANTHROPIC_API_KEY is not set');
		}
		if (!variables.ai.ANTHROPIC_MODEL) {
			throw new Error('ANTHROPIC_MODEL is not set');
		}
		this.anthropic = new Anthropic({
			apiKey: variables.ai.ANTHROPIC_API_KEY,
		});
		this.mcp = new Client({ name: 'mcp-client-cli', version: '1.0.0' });
	}

	async connectToServer(serverScriptPath: string) {
		try {
			const command = process.execPath;
			this.transport = new StdioClientTransport({
				command,
				args: [serverScriptPath],
			});
			await this.mcp.connect(this.transport);
			const toolsResult = await this.mcp.listTools();
			this.tools = toolsResult.tools.map(tool => {
				return {
					name: tool.name,
					description: tool.description,
					input_schema: tool.inputSchema,
				};
			});
			console.log(
				'Connected to server with tools:',
				this.tools.map(({ name }) => name),
			);
		} catch (e) {
			console.log('Failed to connect to MCP server: ', e);
			throw e;
		}
	}

	async processQuery(query: string) {
		const messages: MessageParam[] = [
			{
				role: 'user',
				content: query,
			},
		];
		const response = await this.anthropic.messages.create({
			model: variables.ai.ANTHROPIC_MODEL,
			max_tokens: 1000,
			messages,
			tools: this.tools,
		});
		const finalText = [];
		for (const content of response.content) {
			if (content.type === 'text') {
				finalText.push(content.text);
			} else if (content.type === 'tool_use') {
				const toolName = content.name;
				const toolArgs = content.input as
					| { [x: string]: unknown }
					| undefined;
				const result = (await this.mcp.callTool({
					name: toolName,
					arguments: toolArgs,
				})) as { content: { type: string; text: string }[] };
				finalText.push(
					`[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`,
				);
				finalText.push(
					`Response from tool ${toolName}: ${
						result.content[0].type === 'text'
							? result.content[0].text
							: ''
					}`,
				);
			}
		}
		return finalText;
	}

	async cleanup() {
		await this.mcp.close();
	}
}
