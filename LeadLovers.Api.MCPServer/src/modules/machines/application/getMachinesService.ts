import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { GetMachinesToolInput, GetMachinesToolOutput } from '../presentation/schemas/getMachines';

export class GetMachinesService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: GetMachinesToolInput): Promise<GetMachinesToolOutput> {
    try {
      const response = await this.leadloversApi.get(
        `/Machines?token={token}&page={page}&registers={registers}&details={details}&types={types}`
          .replace('{token}', encodeURIComponent(variables.leadlovers.API_TOKEN || ''))
          .replace('{page}', encodeURIComponent((input.page || 0).toString()))
          .replace('{registers}', encodeURIComponent((input.registers || 10).toString()))
          .replace('{details}', encodeURIComponent((input.details || 0).toString()))
          .replace('{types}', encodeURIComponent(input.types || ''))
      );
      if (response.isSuccess && response.data) {
        return response.data;
      }
      return {
        Items: [],
        CurrentPage: 0,
        Registers: 0,
      };
    } catch (error: any) {
      if (error.response?.data?.Message) {
        process.stderr.write(`[MCP Server] ${error.response.data.Message}\n`);
        return {
          Items: [],
          CurrentPage: 0,
          Registers: 0,
        };
      }
      process.stderr.write(`[MCP Server] Error fetching machines: ${error.message}\n`);
      return {
        Items: [],
        CurrentPage: 0,
        Registers: 0,
      };
    }
  }
}
