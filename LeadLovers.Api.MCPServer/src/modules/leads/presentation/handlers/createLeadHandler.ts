import { CreateLeadService } from 'modules/leads/application/createLeadService';
import { createLeadToolInput, CreateLeadToolOutput, createLeadToolOutput } from '../schemas/createLead';
import { Result } from 'shared/types/defaultResult';

export class CreateLeadHandler {
  constructor(private readonly createLeadService: CreateLeadService) {}

  public async handle(args: unknown): Promise<Result<CreateLeadToolOutput>> {
    const input = createLeadToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: create_lead - Error: ${input.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    const result = await this.createLeadService.execute(input.data);
    if (!result.isSuccess) {
      process.stderr.write(`[MCP Server] Tool: create_lead - Error: ${result.message}\n`);
      return {
        isSuccess: false,
        message: result.message,
        data: null,
      };
    }
    const output = createLeadToolOutput.safeParse(result.data);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: create_lead - Error: ${output.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    return {
      isSuccess: true,
      message: 'Lead created successfully',
      data: output.data,
    };
  }
}
