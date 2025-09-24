import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import {
  GetMachineDetailsToolInput,
  GetMachineDetailsToolOutput,
} from '../presentation/schemas/getMachineDetails';

export class GetMachineDetailsService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: GetMachineDetailsToolInput): Promise<GetMachineDetailsToolOutput> {
    try {
      const response = await this.leadloversApi.get(
        `/Machines?token={token}&machineCode={machineCode}&details=1`
          .replace('{token}', encodeURIComponent(variables.leadlovers.API_TOKEN || ''))
          .replace('{machineCode}', encodeURIComponent(input.machineCode.toString()))
      );
      if (response.isSuccess && response.data) {
        return response.data;
      }
      return {
        Items: [],
      };
    } catch (error: any) {
      if (error.message && error.message.includes('JSON')) {
        return {
          Items: [],
        };
      }
      if (error.response?.data?.Message) {
        process.stderr.write(`[MCP Server] ${error.response.data.Message}\n`);
        return {
          Items: [],
        };
      }
      process.stderr.write(`[MCP Server] Error fetching machine details: ${error.message}\n`);
      return {
        Items: [],
      };
    }
  }
}
