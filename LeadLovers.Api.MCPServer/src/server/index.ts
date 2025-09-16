#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  CallToolResult,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { LeadLoversAPIService } from '../services/leadlovers-api';
import { appConfig } from './config';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  executeGetEmailSequences,
  getEmailSequencesTool,
} from 'tools/email-sequence/get-email-sequence';
import { deleteLeadTool, executeDeleteLead } from 'tools/leads/delete-lead';
import { executeGetLeads, getLeadsTool } from 'tools/leads/get-leads';
import { executeUpdateLead, updateLeadTool } from 'tools/leads/update-lead';
import {
  executeGetMachineDetails,
  getMachineDetailsTool,
} from 'tools/machines/get-machine-details';
import { executeGetMachines, getMachinesTool } from 'tools/machines/get-machines';
import { createLeadTool, executeCreateLead } from '../tools/leads/create-lead';

class LeadLoversMCPServer {
  private server: Server;
  private apiService: LeadLoversAPIService;

  constructor() {
    this.server = new Server(
      {
        name: appConfig.MCP_SERVER_NAME,
        version: appConfig.MCP_SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiService = new LeadLoversAPIService();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          createLeadTool,
          getMachinesTool,
          getEmailSequencesTool,
          getMachineDetailsTool,
          updateLeadTool,
          deleteLeadTool,
          getLeadsTool,
        ],
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      try {
        // Timeout para operações
        const timeoutPromise = new Promise<CallToolResult>((_, reject) =>
          setTimeout(() => reject(new Error('Operação timeout após 30 segundos')), 30000)
        );

        const operation = (async (): Promise<CallToolResult> => {
          switch (name) {
            case getLeadsTool.name:
              const getLeadsResult = await executeGetLeads(args, this.apiService);
              return {
                content: getLeadsResult.content,
                isError: getLeadsResult.isError,
              };

            case createLeadTool.name:
              const createResult = await executeCreateLead(args, this.apiService);
              return {
                content: createResult.content,
                isError: createResult.isError,
              };

            case updateLeadTool.name:
              const updateResult = await executeUpdateLead(args, this.apiService);
              return {
                content: updateResult.content,
                isError: updateResult.isError,
              };

            case deleteLeadTool.name:
              const deleteResult = await executeDeleteLead(args, this.apiService);
              return {
                content: deleteResult.content,
                isError: deleteResult.isError,
              };

            case getMachinesTool.name:
              const getMachinesResult = await executeGetMachines(args, this.apiService);
              return {
                content: getMachinesResult.content,
                isError: getMachinesResult.isError,
              };

            case getMachineDetailsTool.name:
              const getMachineDetailsResult = await executeGetMachineDetails(args, this.apiService);
              return {
                content: getMachineDetailsResult.content,
                isError: getMachineDetailsResult.isError,
              };

            case getEmailSequencesTool.name:
              const getEmailSequencesResult = await executeGetEmailSequences(args, this.apiService);
              return {
                content: getEmailSequencesResult.content,
                isError: getEmailSequencesResult.isError,
              };

            default:
              return {
                content: [
                  {
                    type: 'text',
                    text: `❌ Ferramenta desconhecida: ${name}`,
                  },
                ],
                isError: true,
              };
          }
        })();

        return await Promise.race([operation, timeoutPromise]);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        process.stderr.write(`[MCP Server] Error executing tool ${name}: ${errorMessage}\n`);

        return {
          content: [
            {
              type: 'text',
              text: `❌ Erro ao executar ${name}: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });

    // Error handling
    this.server.onerror = error => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      process.stderr.write(`[MCP Server] Error: ${errorMessage}\n`);
    };

    // Shutdown handlers
    process.on('SIGINT', async () => {
      process.stderr.write('[MCP Server] Shutting down gracefully...\n');
      await this.server.close();
      process.exit(0);
    });

    // SIGTERM shutdown
    process.on('SIGTERM', async () => {
      process.stderr.write('[MCP Server] Shutting down gracefully...\n');
      await this.server.close();
      process.exit(0);
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Start server
async function main(): Promise<void> {
  try {
    const server = new LeadLoversMCPServer();
    await server.start();
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
