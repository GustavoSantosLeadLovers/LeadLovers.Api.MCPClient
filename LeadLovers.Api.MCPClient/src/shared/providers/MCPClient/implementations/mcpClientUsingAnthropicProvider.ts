import { Anthropic } from '@anthropic-ai/sdk';
import {
	MessageParam,
	Tool,
} from '@anthropic-ai/sdk/resources/messages/messages.mjs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

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

	public async connectToServer(serverScriptPath: string) {
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
			logger.info(
				`Connected to server with tools: ${this.tools.map(t => t.name)}`,
			);
		} catch (e) {
			logger.error(`Failed to connect to MCP server: ${e}`);
			throw e;
		}
	}

	public async processQuery(query: string) {
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
		const toolResult: MCPClientResult = {
			status: 'error',
			result: 'No tool result',
		};
		for (const content of response.content) {
			if (content.type === 'text') {
				logger.info(`[Model response: ${content.text}]`);
				toolResult.status = 'success';
				toolResult.result = content.text;
			} else if (content.type === 'tool_use') {
				const toolName = content.name;
				const toolArgs = content.input as
					| { [x: string]: unknown }
					| undefined;
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

	async cleanup() {
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
