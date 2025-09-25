import { GetLeadsService } from 'modules/leads/application/getLeadsService';
import { getLeadsToolInput, getLeadsToolOutput } from '../schemas/getLeads';

export class GetLeadsHandler {
  constructor(private readonly getLeadsService: GetLeadsService) {}

  public async handle(args: unknown) {
    const input = getLeadsToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: get_leads - Error: ${input.error.message}\n`);
      return {
        status: 'error',
        text: 'Invalid input',
      };
    }
    const result = await this.getLeadsService.execute(input.data);
    const output = getLeadsToolOutput.safeParse(result);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: get_leads - Error: ${output.error.message}\n`);
      return {
        status: 'error',
        text: 'Invalid input',
      };
    }
    return {
      status: 'success',
      text: JSON.stringify(output.data, null, 2),
    };
  }
}
