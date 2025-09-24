import { GetMachineDetailsService } from 'modules/machines/application/getMachineDetailsService';
import {
  getMachineDetailsToolInput,
  getMachineDetailsToolOutput,
} from 'modules/machines/presentation/schemas/getMachineDetails';

export class GetMachineDetailsHandler {
  constructor(private readonly getMachineDetailsService: GetMachineDetailsService) {}

  public async handle(args: unknown) {
    const input = getMachineDetailsToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(
        `[MCP Server] Tool: get_machine_details - Error: ${input.error.message}\n`
      );
      return {
        status: 'error',
        text: 'Invalid input',
      };
    }
    const result = await this.getMachineDetailsService.execute(input.data);
    const output = getMachineDetailsToolOutput.safeParse(result);
    if (!output.success) {
      process.stderr.write(
        `[MCP Server] Tool: get_machine_details - Error: ${output.error.message}\n`
      );
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
