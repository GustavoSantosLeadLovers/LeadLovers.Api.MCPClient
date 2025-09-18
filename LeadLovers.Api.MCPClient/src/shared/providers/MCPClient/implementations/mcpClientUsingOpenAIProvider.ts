import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import OpenAI from 'openai';
import {
	ChatCompletionFunctionTool,
	ChatCompletionMessageFunctionToolCall,
} from 'openai/resources/index';

import { IMCPClientProvider } from '../interfaces/mcpClientProvider';

export class McpClientUsingOpenAIProvider implements IMCPClientProvider {
	private mcp: Client;
	private transport: StdioClientTransport | null = null;
	private openai: OpenAI;
	private tools: ChatCompletionFunctionTool[] = [];

	constructor() {
		const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
		if (!OPENAI_API_KEY) {
			throw new Error('OPENAI_API_KEY is not set');
		}
		this.openai = new OpenAI({
			apiKey: OPENAI_API_KEY,
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
					type: 'function' as const,
					function: {
						name: tool.name,
						description: tool.description || '',
						parameters: tool.inputSchema || {
							type: 'object',
							properties: {},
						},
					},
				};
			});
			console.log(
				'Connected to server with tools:',
				this.tools.map(t => t.function.name),
			);
		} catch (e) {
			console.log('Failed to connect to MCP server: ', e);
			throw e;
		}
	}

	async processQuery(query: string) {
		const messages: OpenAI.ChatCompletionMessageParam[] = [
			{
				role: 'user',
				content: query,
			},
		];
		const response = await this.openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages,
			tools: this.tools,
			tool_choice: 'auto',
		});
		const finalText = [];
		const message = response.choices[0].message;
		if (message.content) {
			finalText.push(message.content);
		}
		if (message.tool_calls) {
			for (const toolCall of message.tool_calls as ChatCompletionMessageFunctionToolCall[]) {
				const toolName = toolCall.function.name;
				const toolArgs = JSON.parse(toolCall.function.arguments);
				finalText.push(
					`[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`,
				);
				try {
					const result = await this.mcp.callTool({
						name: toolName,
						arguments: toolArgs,
					});
					const resultContent =
						(result.content as Array<{
							type: string;
							text?: string;
						}>) || [];
					const resultText = resultContent
						.filter(c => c.type === 'text' && c.text)
						.map(c => c.text)
						.join('\n');
					console.info(
						`Response from tool ${toolName}: ${resultText}`,
					);
					finalText.push(
						`Response from tool ${toolName}: ${resultText}`,
					);
				} catch (error) {
					finalText.push(
						`Error calling tool ${toolName}: ${
							error instanceof Error
								? error.message
								: String(error)
						}`,
					);
				}
			}
		}
		return finalText;
	}

	async cleanup() {
		await this.mcp.close();
	}
}
