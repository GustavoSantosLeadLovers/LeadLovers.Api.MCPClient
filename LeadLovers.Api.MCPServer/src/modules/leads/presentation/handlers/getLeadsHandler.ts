import { GetLeadsService } from 'modules/leads/application/getLeadsService';
import { getLeadsToolInput, GetLeadsToolOutput, getLeadsToolOutput } from '../schemas/getLeads';
import { Result } from 'shared/types/defaultResult';

export class GetLeadsHandler {
  constructor(private readonly getLeadsService: GetLeadsService) {}

  public async handle(args: unknown): Promise<Result<GetLeadsToolOutput>> {
    const input = getLeadsToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: get_leads - Error: ${input.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    const result = await this.getLeadsService.execute(input.data);
    if (!result.isSuccess) {
      process.stderr.write(`[MCP Server] Tool: get_leads - Error: ${result.message}\n`);
      return {
        isSuccess: false,
        message: result.message,
        data: null,
      };
    }
    const output = getLeadsToolOutput.safeParse(result.data);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: get_leads - Error: ${output.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    return {
      isSuccess: true,
      message: 'Leads fetched successfully',
      data: output.data,
    };
  }
}
