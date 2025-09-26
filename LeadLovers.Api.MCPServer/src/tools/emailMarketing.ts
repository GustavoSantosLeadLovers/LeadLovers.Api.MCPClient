import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { CreateEmailContentService } from 'modules/emailMarketing/application/createEmailContentService.';
import { CreateEmailContentHandler } from 'modules/emailMarketing/presentation/handlers/createEmailContentHandler';
import { createEmailContentInputShape } from 'modules/emailMarketing/presentation/schemas/createEmailContent';
import { AnthropicAPIProvider } from 'shared/providers/AIAPI/implementations/anthropicAPIProvider';
import { BeeFreeEmailBuilderProvider } from 'shared/providers/BuiderProvider/implementations/BeeFreeEmailBuilderPrivider';

const anthropicAPI = new AnthropicAPIProvider();
const beeFreeAPI = new BeeFreeEmailBuilderProvider();

const createEmailContentService = new CreateEmailContentService(anthropicAPI, beeFreeAPI);

const createEmailContentHandler = new CreateEmailContentHandler(createEmailContentService);

const registerCreateContentTool = (server: McpServer) => {
  server.registerTool(
    'create_email_content',
    {
      title: 'Create a e-mail content',
      description: 'Create a email marketing content based on the provided information.',
      inputSchema: createEmailContentInputShape,
    },
    async args => {
      const result = await createEmailContentHandler.handle(args);
      return {
        content: [
          {
            type: 'resource',
            resource: {
              uri: 'leadlovers://email-marketing',
              mimeType: 'application/json',
              text: JSON.stringify(result, null, 2),
            },
          },
        ],
      };
    }
  );
};

export const emailMarketingTools = (server: McpServer) => {
  registerCreateContentTool(server);
};
