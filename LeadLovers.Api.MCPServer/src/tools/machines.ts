import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { GetMachineDetailsService } from 'modules/machines/application/getMachineDetailsService';
import { GetMachinesService } from 'modules/machines/application/getMachinesService';
import { GetMachineDetailsHandler } from 'modules/machines/presentation/handlers/getMachineDetailsHandler';
import { GetMachinesHandler } from 'modules/machines/presentation/handlers/getMachinesHandler';
import { getMachineDetailsInputShape } from 'modules/machines/presentation/schemas/getMachineDetails';
import { getMachinesInputShape } from 'modules/machines/presentation/schemas/getMachines';
import { LeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/implementations/leadloversAPIProvider';

const leadloversAPI = new LeadLoversAPIProvider();

const getMachinesService = new GetMachinesService(leadloversAPI);
const getMachineDetailsService = new GetMachineDetailsService(leadloversAPI);

const getMachinesHandler = new GetMachinesHandler(getMachinesService);
const getMachineDetailsHandler = new GetMachineDetailsHandler(getMachineDetailsService);

const registerGetMachinesTool = (server: McpServer) => {
  server.registerTool(
    'get_machines',
    {
      title: 'Get Machines',
      description: "Fetches a list of machines from the user's LeadLovers account",
      inputSchema: getMachinesInputShape,
    },
    async args => {
      const result = await getMachinesHandler.handle(args);
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
};

const registerGetMachineDetailsTool = (server: McpServer) => {
  server.registerTool(
    'get_machine_details',
    {
      title: 'Get Machine Details',
      description: "Fetches details of a specific machine from the user's LeadLovers account",
      inputSchema: getMachineDetailsInputShape,
    },
    async args => {
      const result = await getMachineDetailsHandler.handle(args);
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
};

export const machinesTools = (server: McpServer) => {
  registerGetMachinesTool(server);
  registerGetMachineDetailsTool(server);
};
