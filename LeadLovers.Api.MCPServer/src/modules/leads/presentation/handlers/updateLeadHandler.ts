import { UpdateLeadService } from 'modules/leads/application/updateLeadService';
import { updateLeadToolInput, UpdateLeadToolOutput, updateLeadToolOutput } from '../schemas/updateLead';
import { Result } from 'shared/types/defaultResult';

export class UpdateLeadHandler {
  constructor(private readonly updateLeadService: UpdateLeadService) {}

  public async handle(args: unknown): Promise<Result<UpdateLeadToolOutput>> {
    const input = updateLeadToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: update_lead - Error: ${input.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    const result = await this.updateLeadService.execute(input.data);
    if (!result.isSuccess) {
      process.stderr.write(`[MCP Server] Tool: update_lead - Error: ${result.message}\n`);
      return {
        isSuccess: false,
        message: result.message,
        data: null,
      };
    }
    const output = updateLeadToolOutput.safeParse(result.data);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: update_lead - Error: ${output.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    return {
      isSuccess: true,
      message: 'Lead updated successfully',
      data: output.data,
    };
  }
}
