import { DeleteLeadService } from 'modules/leads/application/deleteLeadService';
import { deleteLeadToolInput, deleteLeadToolOutput } from '../schemas/deleteLead';

export class DeleteLeadHandler {
  constructor(private readonly deleteLeadService: DeleteLeadService) {}

  public async handle(args: unknown) {
    const input = deleteLeadToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: delete_lead - Error: ${input.error.message}\n`);
      return {
        status: 'error',
        text: 'Invalid input',
      };
    }
    const result = await this.deleteLeadService.execute(input.data);
    const output = deleteLeadToolOutput.safeParse(result);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: delete_lead - Error: ${output.error.message}\n`);
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
