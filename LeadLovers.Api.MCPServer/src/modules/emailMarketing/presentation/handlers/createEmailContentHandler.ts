import { CreateEmailContentService } from 'modules/emailMarketing/application/createEmailContentService.';
import { createEmailContentToolInput, createEmailContentToolOutput } from '../schemas/createEmailContent';

export class CreateEmailContentHandler {
  constructor(private readonly createEmailContentService: CreateEmailContentService) {}

  public async handle(args: unknown) {
    const input = createEmailContentToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: create_email_content - Error: ${input.error.message}\n`);
      return {
        status: 'error',
        text: 'Invalid input',
      };
    }
    const result = await this.createEmailContentService.execute(input.data);
    const output = createEmailContentToolOutput.safeParse(result);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: create_email_content - Error: ${output.error.message}\n`);
      return {
        status: 'error',
        text: 'Invalid output',
      };
    }
    return {
      status: 'success',
      text: JSON.stringify(output.data, null, 2),
    };
  }
}
