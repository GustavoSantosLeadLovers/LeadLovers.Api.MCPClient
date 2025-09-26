import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import OpenAI from 'openai';
import {
	ChatCompletionFunctionTool,
	ChatCompletionMessageFunctionToolCall,
} from 'openai/resources/index';

import logger from '@infra/logger/pinoLogger';
import { variables } from '@shared/configs/variables';
import {
	ResourceContent,
	TextContent,
} from '../../../../../../LeadLovers.Api.MCPServer/src/shared/types/contentResponse';
import {
	IMCPClientProvider,
	MCPClientResult,
} from '../interfaces/mcpClientProvider';

export class McpClientUsingOpenAIProvider implements IMCPClientProvider {
	private mcp: Client;
	private transport: StdioClientTransport | null = null;
	private openai: OpenAI;
	private tools: ChatCompletionFunctionTool[] = [];

	constructor() {
		if (!variables.ai.OPENAI_API_KEY) {
			throw new Error('OPENAI_API_KEY is not set');
		}
		if (!variables.ai.OPENAI_MODEL) {
			throw new Error('OPENAI_MODEL is not set');
		}
		this.openai = new OpenAI({
			apiKey: variables.ai.OPENAI_API_KEY,
		});
		this.mcp = new Client({ name: 'mcp-client-cli', version: '1.0.0' });
	}

	public async connectToServer(serverScriptPath: string): Promise<void> {
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
			logger.info(
				`Connected to server with tools: ${this.tools.map(t => t.function.name)}`,
			);
		} catch (e) {
			logger.error(`Failed to connect to MCP server: ${e}`);
			throw e;
		}
	}

	public async processQuery(query: string): Promise<MCPClientResult> {
		const messages: OpenAI.ChatCompletionMessageParam[] = [
			{
				role: 'user',
				content: query,
			},
		];
		const response = await this.openai.chat.completions.create({
			model: variables.ai.OPENAI_MODEL,
			messages,
			tools: this.tools,
			tool_choice: 'auto',
		});
		const { message } = response.choices[0];
		if (message.content) {
			logger.info(`[Model response: ${message.content}]`);
			return { status: 'success', result: message.content };
		}
		const toolResult: MCPClientResult = {
			status: 'error',
			result: 'No tool result',
		};
		if (message.tool_calls) {
			for (const toolCall of message.tool_calls as ChatCompletionMessageFunctionToolCall[]) {
				const toolName = toolCall.function.name;
				const toolArgs = JSON.parse(toolCall.function.arguments);
				logger.info(
					`Calling tool: ${toolName} with args: ${JSON.stringify(toolArgs)}`,
				);
				try {
					const result = await this.mcp.callTool({
						name: toolName,
						arguments: toolArgs,
					});
					const resultContent = result.content as
						| TextContent[]
						| ResourceContent[];
					resultContent.map(c => {
						if (this.isTextResponse(c)) {
							const resultText = (c as TextContent).text;
							logger.info(
								`Response from tool: ${toolName}: ${resultText}`,
							);
							toolResult.status = 'success';
							toolResult.result = resultText;
							return;
						}
						if (this.isResourceResponse(c)) {
							logger.info(
								`Response from tool: ${toolName}: ${(c as ResourceContent).resource.text}`,
							);
							const result = JSON.parse(
								(c as ResourceContent).resource.text,
							);
							toolResult.status = result.isSuccess
								? 'success'
								: 'error';
							toolResult.result = result;
							return;
						}
					});
				} catch (error) {
					logger.error(
						`Error calling tool ${toolName}: ${
							error instanceof Error
								? error.message
								: String(error)
						}`,
					);
					toolResult.result = `Error calling tool ${toolName}: ${
						error instanceof Error ? error.message : String(error)
					}`;
				}
			}
		}
		return toolResult;
	}

	public async cleanup(): Promise<void> {
		await this.mcp.close();
	}

	private isTextResponse(content: TextContent | ResourceContent): boolean {
		return content?.type === 'text' && 'text' in content;
	}

	private isResourceResponse(
		content: TextContent | ResourceContent,
	): boolean {
		return content?.type === 'resource' && 'resource' in content;
	}
}
