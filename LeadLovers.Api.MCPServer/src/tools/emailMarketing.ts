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
      description: "Create a email marketing content based on the provided information.",
      inputSchema: createEmailContentInputShape,
    },
    async args => {
      const result = await createEmailContentHandler.handle(args);
      if (result.status === 'error') {
        return {
          content: [{ type: 'text', text: result.text }],
        };
      }
      return {
        content: [
          {
            type: 'resource',
            resource: {
              uri: 'leadlovers://leads',
              mimeType: 'application/json',
              text: result.text,
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
