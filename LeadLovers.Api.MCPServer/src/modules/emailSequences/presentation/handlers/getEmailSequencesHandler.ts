import { GetEmailSequencesService } from 'modules/emailSequences/application/getEmailSequencesService';
import {
  getEmailSequencesToolInput,
  getEmailSequencesToolOutput,
} from 'modules/emailSequences/presentation/schemas/getEmailSequences';

export class GetEmailSequencesHandler {
  constructor(private readonly getEmailSequencesService: GetEmailSequencesService) {}

  public async handle(args: unknown) {
    const input = getEmailSequencesToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(
        `[MCP Server] Tool: get_email_sequences - Error: ${input.error.message}\n`
      );
      return {
        status: 'error',
        text: 'Invalid input',
      };
    }
    const result = await this.getEmailSequencesService.execute(input.data);
    const output = getEmailSequencesToolOutput.safeParse(result);
    if (!output.success) {
      process.stderr.write(
        `[MCP Server] Tool: get_email_sequences - Error: ${output.error.message}\n`
      );
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
