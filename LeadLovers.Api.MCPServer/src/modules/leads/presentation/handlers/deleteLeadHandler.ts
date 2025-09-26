import { DeleteLeadService } from 'modules/leads/application/deleteLeadService';
import { deleteLeadToolInput, DeleteLeadToolOutput, deleteLeadToolOutput } from '../schemas/deleteLead';
import { Result } from 'shared/types/defaultResult';

export class DeleteLeadHandler {
  constructor(private readonly deleteLeadService: DeleteLeadService) {}

  public async handle(args: unknown): Promise<Result<DeleteLeadToolOutput>> {
    const input = deleteLeadToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: delete_lead - Error: ${input.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    const result = await this.deleteLeadService.execute(input.data);
    if (!result.isSuccess) {
      process.stderr.write(`[MCP Server] Tool: delete_lead - Error: ${result.message}\n`);
      return {
        isSuccess: false,
        message: result.message,
        data: null,
      };
    }
    const output = deleteLeadToolOutput.safeParse(result.data);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: delete_lead - Error: ${output.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    return {
      isSuccess: true,
      message: 'Lead deleted successfully',
      data: output.data,
    };
  }
}
