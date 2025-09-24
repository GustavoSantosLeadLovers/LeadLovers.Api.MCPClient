import { CreateLeadService } from 'modules/leads/application/createLeadService';
import { createLeadToolInput, createLeadToolOutput } from '../schemas/createLead';

export class CreateLeadHandler {
  constructor(private readonly createLeadService: CreateLeadService) {}

  public async handle(args: unknown) {
    const input = createLeadToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: create_lead - Error: ${input.error.message}\n`);
      return {
        status: 'error',
        text: 'Invalid input',
      };
    }
    const result = await this.createLeadService.execute(input.data);
    const output = createLeadToolOutput.safeParse(result);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: create_lead - Error: ${output.error.message}\n`);
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
