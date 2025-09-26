import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { Result } from 'shared/types/defaultResult';
import { GetMachinesToolInput, GetMachinesToolOutput } from '../presentation/schemas/getMachines';

export class GetMachinesService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: GetMachinesToolInput): Promise<Result<GetMachinesToolOutput>> {
    try {
      const response = await this.leadloversApi.get<any, GetMachinesToolOutput>(
        `/Machines?token={token}&page={page}&registers={registers}&details={details}&types={types}`
          .replace('{token}', encodeURIComponent(variables.leadlovers.API_TOKEN || ''))
          .replace('{page}', encodeURIComponent((input.page || 0).toString()))
          .replace('{registers}', encodeURIComponent((input.registers || 10).toString()))
          .replace('{details}', encodeURIComponent((input.details || 0).toString()))
          .replace('{types}', encodeURIComponent(input.types || ''))
      );
      if (response.isSuccess && response.data) {
        return {
          isSuccess: true,
          message: 'Machines fetched successfully',
          data: response.data as GetMachinesToolOutput,
        };
      }
      return {
        isSuccess: false,
        message: 'Failed to fetch machines',
        data: {
          Items: [],
          CurrentPage: 0,
          Registers: 0,
        },
      };
    } catch (error: any) {
      let message = 'Failed to fetch machines';
      if (error.response?.data?.Message) message = error.response.data.Message;
      if (error.message) message = error.message;
      process.stderr.write(`[MCP Server] Error fetching machines: ${message}\n`);
      return {
        isSuccess: false,
        message,
        data: {
          Items: [],
          CurrentPage: 0,
          Registers: 0,
        },
      };
    }
  }
}
