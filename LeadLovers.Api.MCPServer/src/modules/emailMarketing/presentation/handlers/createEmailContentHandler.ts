import { CreateEmailContentService } from 'modules/emailMarketing/application/createEmailContentService.';
import { createEmailContentToolInput, CreateEmailContentToolOutput, createEmailContentToolOutput } from '../schemas/createEmailContent';
import { Result } from 'shared/types/defaultResult';

export class CreateEmailContentHandler {
  constructor(private readonly createEmailContentService: CreateEmailContentService) {}

  public async handle(args: unknown): Promise<Result<CreateEmailContentToolOutput>> {
    const input = createEmailContentToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: create_email_content - Error: ${input.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    const result = await this.createEmailContentService.execute(input.data);
    if (!result.isSuccess) {
      process.stderr.write(`[MCP Server] Tool: create_email_content - Error: ${result.message}\n`);
      return {
        isSuccess: false,
        message: result.message,
        data: null,
      };
    }
    const output = createEmailContentToolOutput.safeParse(result.data);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: create_email_content - Error: ${output.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    return {
      isSuccess: true,
      message: 'Email content created successfully',
      data: output.data,
    };
  }
}
