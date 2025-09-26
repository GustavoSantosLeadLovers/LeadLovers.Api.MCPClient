import { GetMachineDetailsService } from 'modules/machines/application/getMachineDetailsService';
import {
  getMachineDetailsToolInput,
  GetMachineDetailsToolOutput,
  getMachineDetailsToolOutput,
} from 'modules/machines/presentation/schemas/getMachineDetails';
import { Result } from 'shared/types/defaultResult';

export class GetMachineDetailsHandler {
  constructor(private readonly getMachineDetailsService: GetMachineDetailsService) {}

  public async handle(args: unknown): Promise<Result<GetMachineDetailsToolOutput>> {
    const input = getMachineDetailsToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(
        `[MCP Server] Tool: get_machine_details - Error: ${input.error.message}\n`
      );
      return {
        isSuccess: false,
        message: 'Internal server error',
        data: null,
      };
    }
    const result = await this.getMachineDetailsService.execute(input.data);
    if (!result.isSuccess) {
      process.stderr.write(`[MCP Server] Tool: get_machine_details - Error: ${result.message}\n`);
      return {
        isSuccess: false,
        message: result.message,
        data: null,
      };
    }
    const output = getMachineDetailsToolOutput.safeParse(result.data);
    if (!output.success) {
      process.stderr.write(
        `[MCP Server] Tool: get_machine_details - Error: ${output.error.message}\n`
      );
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
