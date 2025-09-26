import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { GetEmailSequencesService } from 'modules/emailSequences/application/getEmailSequencesService';
import { GetEmailSequencesHandler } from 'modules/emailSequences/presentation/handlers/getEmailSequencesHandler';
import { getEmailSequencesInputShape } from 'modules/emailSequences/presentation/schemas/getEmailSequences';
import { LeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/implementations/leadloversAPIProvider';

const leadloversAPI = new LeadLoversAPIProvider();

const getEmailSequencesService = new GetEmailSequencesService(leadloversAPI);

const getEmailSequencesHandler = new GetEmailSequencesHandler(getEmailSequencesService);

const registerGetEmailSequencesTool = (server: McpServer) => {
  server.registerTool(
    'get_email_sequences',
    {
      title: 'Get Email Sequences',
      description: "Fetches a list of email sequences from the user's LeadLovers account",
      inputSchema: getEmailSequencesInputShape,
    },
    async args => {
      const result = await getEmailSequencesHandler.handle(args);
      return {
        content: [
          {
            type: 'resource',
            resource: {
              uri: 'leadlovers://email-sequences',
              mimeType: 'application/json',
              text: JSON.stringify(result, null, 2),
            },
          },
        ],
      };
    }
  );
};

export const emailSequencesTools = (server: McpServer) => {
  registerGetEmailSequencesTool(server);
};
