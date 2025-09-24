import { UpdateLeadService } from 'modules/leads/application/updateLeadService';
import { updateLeadToolInput, updateLeadToolOutput } from '../schemas/updateLead';

export class UpdateLeadHandler {
  constructor(private readonly updateLeadService: UpdateLeadService) {}

  public async handle(args: unknown) {
    const input = updateLeadToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: update_lead - Error: ${input.error.message}\n`);
      return {
        status: 'error',
        text: 'Invalid input',
      };
    }
    const result = await this.updateLeadService.execute(input.data);
    const output = updateLeadToolOutput.safeParse(result);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: update_lead - Error: ${output.error.message}\n`);
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
