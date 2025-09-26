import { GetMachinesService } from 'modules/machines/application/getMachinesService';
import {
  getMachinesToolInput,
  GetMachinesToolOutput,
  getMachinesToolOutput,
} from 'modules/machines/presentation/schemas/getMachines';
import { Result } from 'shared/types/defaultResult';

export class GetMachinesHandler {
  constructor(private readonly getMachinesService: GetMachinesService) {}

  public async handle(args: unknown): Promise<Result<GetMachinesToolOutput>> {
    const input = getMachinesToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: get_machines - Error: ${input.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    const result = await this.getMachinesService.execute(input.data);
    if (!result.isSuccess) {
      process.stderr.write(`[MCP Server] Tool: get_machines - Error: ${result.message}\n`);
      return {
        isSuccess: false,
        message: result.message,
        data: null,
      };
    }
    const output = getMachinesToolOutput.safeParse(result);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: get_machines - Error: ${output.error.message}\n`);
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    return {
      isSuccess: true,
      message: 'Machine details fetched successfully',
      data: output.data,
    };
  }
}
