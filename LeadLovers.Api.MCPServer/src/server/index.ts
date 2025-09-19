import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { LeadLoversAPIService } from 'services/leadlovers-api';
import { getLeadsInputShape, getLeadsToolInput, getLeadsToolOutput } from 'shared/schemas/getLeads';
import {
  getMachinesInputShape,
  getMachinesToolInput,
  getMachinesToolOutput,
} from 'shared/schemas/getMachines';
import { updateLeadInputShape, updateLeadToolInput } from 'shared/schemas/updateLead';
import { appConfig } from './config';

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

//Leads Tool
server.registerTool(
  'get_leads',
  {
    title: 'Get Leads',
    description: "Fetches a list of leads from the user's LeadLovers account",
    inputSchema: getLeadsInputShape,
  },
  async args => {
    const validatedArgs = getLeadsToolInput.parse(args);
    const apiService = new LeadLoversAPIService();
    const leads = await apiService.getLeads(validatedArgs);
    const result = getLeadsToolOutput.parse(leads);
    return {
      content: [
        {
          type: 'resource',
          resource: {
            uri: 'leadlovers://machines',
            mimeType: 'application/json',
            text: JSON.stringify(result, null, 2),
          },
        },
      ],
    };
  }
);

server.registerTool(
  'update_lead',
  {
    title: 'Update Lead',
    description: "Updates an existing lead in the user's LeadLovers account",
    inputSchema: updateLeadInputShape,
  },
  async args => {
    const validatedArgs = updateLeadToolInput.parse(args);
    const apiService = new LeadLoversAPIService();
    const leads = await apiService.updateLead(validatedArgs);
    const result = getLeadsToolOutput.parse(leads);
    return {
      content: [
        {
          type: 'resource',
          resource: {
            uri: 'leadlovers://machines',
            mimeType: 'application/json',
            text: JSON.stringify(result, null, 2),
          },
        },
      ],
    };
  }
);

//Machines Tool
server.registerTool(
  'get_machines',
  {
    title: 'Get Machines',
    description: "Fetches a list of machines from the user's LeadLovers account",
    inputSchema: getMachinesInputShape,
  },
  async args => {
    const validatedArgs = getMachinesToolInput.parse(args);
    const apiService = new LeadLoversAPIService();
    const machines = await apiService.getMachines(validatedArgs);
    const result = getMachinesToolOutput.parse(machines);
    return {
      content: [
        {
          type: 'resource',
          resource: {
            uri: 'leadlovers://machines',
            mimeType: 'application/json',
            text: JSON.stringify(result, null, 2),
          },
        },
      ],
    };
  }
);

// Start server
async function main(): Promise<void> {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    process.stderr.write(`[MCP Server] Running ${appConfig.MCP_SERVER_NAME} on stdio\n`);
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

// Start the server
main().catch(error => process.stderr.write(`Main error: ${error}\n`));
