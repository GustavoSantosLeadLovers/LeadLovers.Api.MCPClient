import { GetMachinesService } from 'modules/machines/application/getMachinesService';
import {
  getMachinesToolInput,
  getMachinesToolOutput,
} from 'modules/machines/presentation/schemas/getMachines';

export class GetMachinesHandler {
  constructor(private readonly getMachinesService: GetMachinesService) {}

  public async handle(args: unknown) {
    const input = getMachinesToolInput.safeParse(args);
    if (!input.success) {
      process.stderr.write(`[MCP Server] Tool: get_machines - Error: ${input.error.message}\n`);
      return {
        status: 'error',
        text: 'Invalid input',
      };
    }
    const result = await this.getMachinesService.execute(input.data);
    const output = getMachinesToolOutput.safeParse(result);
    if (!output.success) {
      process.stderr.write(`[MCP Server] Tool: get_machines - Error: ${output.error.message}\n`);
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
