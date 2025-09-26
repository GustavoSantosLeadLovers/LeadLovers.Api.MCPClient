import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { Result } from 'shared/types/defaultResult';
import {
  GetMachineDetailsToolInput,
  GetMachineDetailsToolOutput,
} from '../presentation/schemas/getMachineDetails';

export class GetMachineDetailsService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(
    input: GetMachineDetailsToolInput
  ): Promise<Result<GetMachineDetailsToolOutput>> {
    try {
      const response = await this.leadloversApi.get<any, GetMachineDetailsToolOutput>(
        `/Machines?token={token}&machineCode={machineCode}&details=1`
          .replace('{token}', encodeURIComponent(variables.leadlovers.API_TOKEN || ''))
          .replace('{machineCode}', encodeURIComponent(input.machineCode.toString()))
      );
      if (response.isSuccess && response.data) {
        return {
          isSuccess: true,
          message: 'Machine details fetched successfully',
          data: response.data as GetMachineDetailsToolOutput,
        };
      }
      return {
        isSuccess: false,
        message: 'Failed to fetch machine details',
        data: {
          Items: [],
        },
      };
    } catch (error: any) {
      let message = 'Failed to fetch machine details';
      if (error.response?.data?.Message) message = error.response.data.Message;
      if (error.message) message = error.message;
      process.stderr.write(`[MCP Server] Error fetching machine details: ${error.message}\n`);
      return {
        isSuccess: false,
        message,
        data: {
          Items: [],
        },
      };
    }
  }
}
