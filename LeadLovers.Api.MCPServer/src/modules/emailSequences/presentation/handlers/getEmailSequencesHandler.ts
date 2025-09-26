import { GetEmailSequencesService } from 'modules/emailSequences/application/getEmailSequencesService';
import {
  getEmailSequencesToolInput,
  GetEmailSequencesToolOutput,
  getEmailSequencesToolOutput,
} from 'modules/emailSequences/presentation/schemas/getEmailSequences';
import { Result } from 'shared/types/defaultResult';

export class GetEmailSequencesHandler {
  constructor(private readonly getEmailSequencesService: GetEmailSequencesService) {}

  public async handle(args: unknown): Promise<Result<GetEmailSequencesToolOutput>> {
    const input = getEmailSequencesToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(
        `[MCP Server] Tool: get_email_sequences - Error: ${input.error.message}\n`
      );
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    const result = await this.getEmailSequencesService.execute(input.data);
    if (!result.isSuccess) {
      process.stderr.write(
        `[MCP Server] Tool: get_email_sequences - Error: ${result.message}\n`
      );
      return {
        isSuccess: false,
        message: result.message,
        data: null,
      };
    }
    const output = getEmailSequencesToolOutput.safeParse(result.data);
    if (!output.success) {
      process.stderr.write(
        `[MCP Server] Tool: get_email_sequences - Error: ${output.error.message}\n`
      );
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    return {
      isSuccess: true,
      message: 'Email sequences fetched successfully',
      data: output.data,
    };
  }
}
