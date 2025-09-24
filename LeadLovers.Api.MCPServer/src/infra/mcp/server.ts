import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { variables } from 'shared/configs/variables';
import { registerTools } from 'tools/index';

const server = new McpServer(
  {
    name: 'leadlovers-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

registerTools(server);

// Start server
export async function main(): Promise<void> {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    process.stderr.write(`[MCP Server] Running ${variables.mcp.SERVER_NAME} on stdio\n`);
  } catch (error) {
    process.stderr.write(`[MCP Server] Failed to start: ${error}\n`);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  process.stderr.write(`[MCP Server] Unhandled Rejection at: ${promise} reason: ${reason}\n`);
  process.exit(1);
});

process.on('uncaughtException', error => {
  process.stderr.write(`[MCP Server] Uncaught Exception: ${error}\n`);
  process.exit(1);
});
