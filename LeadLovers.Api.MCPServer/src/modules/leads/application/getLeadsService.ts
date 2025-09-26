import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { Result } from 'shared/types/defaultResult';
import { GetLeadsToolInput, GetLeadsToolOutput } from '../presentation/schemas/getLeads';

export class GetLeadsService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: GetLeadsToolInput): Promise<Result<GetLeadsToolOutput>> {
    try {
      const response = await this.leadloversApi.get<any, GetLeadsToolOutput>(
        `/Leads?token={token}&page={page}&startDate={startDate}&endDate={endDate}`
          .replace('{token}', encodeURIComponent(variables.leadlovers.API_TOKEN || ''))
          .replace('{page}', encodeURIComponent((input.page || 0).toString()))
          .replace('{startDate}', encodeURIComponent(input.startDate ? input.startDate : ''))
          .replace('{endDate}', encodeURIComponent(input.endDate ? input.endDate : ''))
      );
      if (response.isSuccess && response.data) {
        return {
          isSuccess: true,
          message: 'Leads fetched successfully',
          data: response.data as GetLeadsToolOutput,
        };
      }
      return {
        isSuccess: false,
        message: 'Failed to fetch leads',
        data: {
          Data: [],
          Links: {
            Self: null,
            Next: null,
            Prev: null,
          },
        },
      };
    } catch (error: any) {
      let message = 'Failed to fetch leads';
      if (error.response?.data?.Message) message = error.response.data.Message;
      if (error.message) message = error.message;
      process.stderr.write(`[MCP Server] Error fetching leads: ${message}\n`);
      return {
        isSuccess: false,
        message,
        data: {
          Data: [],
          Links: {
            Self: null,
            Next: null,
            Prev: null,
          },
        },
      };
    }
  }
}
