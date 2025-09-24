import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { GetLeadsToolInput, GetLeadsToolOutput } from '../presentation/schemas/getLeads';

export class GetLeadsService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: GetLeadsToolInput): Promise<GetLeadsToolOutput> {
    try {
      const response = await this.leadloversApi.get(
        `/Leads?token={token}&page={page}&startDate={startDate}&endDate={endDate}`
          .replace('{token}', encodeURIComponent(variables.leadlovers.API_TOKEN || ''))
          .replace('{page}', encodeURIComponent((input.page || 0).toString()))
          .replace('{startDate}', encodeURIComponent(input.startDate ? input.startDate : ''))
          .replace('{endDate}', encodeURIComponent(input.endDate ? input.endDate : ''))
      );
      if (response.isSuccess && response.data) {
        return response.data;
      }
      return {
        Data: [],
        Links: {
          Self: null,
          Next: null,
          Prev: null,
        },
      };
    } catch (error: any) {
      if (error.message && error.message.includes('JSON')) {
        process.stderr.write(`[MCP Server] JSON parsing error in getLeads: ${error.message}\n`);
        process.stderr.write(
          `[MCP Server] Raw response might be malformed HTML or text instead of JSON\n`
        );
        return {
          Data: [],
          Links: {
            Self: null,
            Next: null,
            Prev: null,
          },
        };
      }
      if (error.response?.data?.Message) {
        process.stderr.write(`[MCP Server] ${error.response.data.Message}\n`);
        return {
          Data: [],
          Links: {
            Self: null,
            Next: null,
            Prev: null,
          },
        };
      }
      process.stderr.write(`[MCP Server] Error fetching leads: ${error.message}\n`);
      return {
        Data: [],
        Links: {
          Self: null,
          Next: null,
          Prev: null,
        },
      };
    }
  }
}
