import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { GetLeadsService } from 'modules/leads/application/getLeadsService';
import { GetLeadsHandler } from 'modules/leads/presentation/handlers/getLeadsHandler';
import { createLeadInputShape } from 'modules/leads/presentation/schemas/createLead';
import { deleteLeadInputShape } from 'modules/leads/presentation/schemas/deleteLead';
import { getLeadsInputShape } from 'modules/leads/presentation/schemas/getLeads';
import { updateLeadInputShape } from 'modules/leads/presentation/schemas/updateLead';
import { LeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/implementations/leadloversAPIProvider';

const leadloversAPI = new LeadLoversAPIProvider();

const getLeadsService = new GetLeadsService(leadloversAPI);
const createLeadService = new GetLeadsService(leadloversAPI);
const updateLeadService = new GetLeadsService(leadloversAPI);
const deleteLeadService = new GetLeadsService(leadloversAPI);

const getLeadsHandler = new GetLeadsHandler(getLeadsService);
const createLeadHandler = new GetLeadsHandler(createLeadService);
const updateLeadHandler = new GetLeadsHandler(updateLeadService);
const deleteLeadHandler = new GetLeadsHandler(deleteLeadService);

const registerGetLeadsTool = (server: McpServer) => {
  server.registerTool(
    'get_leads',
    {
      title: 'Get Leads',
      description: "Fetches a list of leads from the user's LeadLovers account",
      inputSchema: getLeadsInputShape,
    },
    async args => {
      const result = await getLeadsHandler.handle(args);
      return {
        content: [
          {
            type: 'resource',
            resource: {
              uri: 'leadlovers://leads',
              mimeType: 'application/json',
              text: JSON.stringify(result, null, 2),
            },
          },
        ],
      };
    }
  );
};

const registerCreateLeadTool = (server: McpServer) => {
  server.registerTool(
    'create_lead',
    {
      title: 'Create Lead',
      description: "Creates a new lead in the user's LeadLovers account",
      inputSchema: createLeadInputShape,
    },
    async args => {
      const result = await createLeadHandler.handle(args);
      return {
        content: [
          {
            type: 'resource',
            resource: {
              uri: 'leadlovers://leads',
              mimeType: 'application/json',
              text: JSON.stringify(result, null, 2),
            },
          },
        ],
      };
    }
  );
};

const registerUpdateLeadTool = (server: McpServer) => {
  server.registerTool(
    'update_lead',
    {
      title: 'Update Lead',
      description: "Updates an existing lead in the user's LeadLovers account",
      inputSchema: updateLeadInputShape,
    },
    async args => {
      const result = await updateLeadHandler.handle(args);
      return {
        content: [
          {
            type: 'resource',
            resource: {
              uri: 'leadlovers://leads',
              mimeType: 'application/json',
              text: JSON.stringify(result, null, 2),
            },
          },
        ],
      };
    }
  );
};

const registerDeleteLeadTool = (server: McpServer) => {
  server.registerTool(
    'delete_lead',
    {
      title: 'Delete Lead',
      description:
        'Deletes a lead from a funnel and email sequence in LeadLovers, does not delete the lead from the machine',
      inputSchema: deleteLeadInputShape,
    },
    async (args: unknown) => {
      const result = await deleteLeadHandler.handle(args);
      return {
        content: [
          {
            type: 'resource',
            resource: {
              uri: 'leadlovers://leads',
              mimeType: 'application/json',
              text: JSON.stringify(result, null, 2),
            },
          },
        ],
      };
    }
  );
};

export const leadsTools = (server: McpServer) => {
  registerGetLeadsTool(server);
  registerCreateLeadTool(server);
  registerUpdateLeadTool(server);
  registerDeleteLeadTool(server);
};
