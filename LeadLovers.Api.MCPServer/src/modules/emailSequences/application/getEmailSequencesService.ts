import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import {
  GetEmailSequencesToolInput,
  GetEmailSequencesToolOutput,
} from '../presentation/schemas/getEmailSequences';

export class GetEmailSequencesService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: GetEmailSequencesToolInput): Promise<GetEmailSequencesToolOutput> {
    try {
      const response = await this.leadloversApi.get(
        `/EmailSequences?token={token}&machineCode={machineCode}`
          .replace('{token}', encodeURIComponent(variables.leadlovers.API_TOKEN || ''))
          .replace('{machineCode}', encodeURIComponent(input.machineCode.toString()))
      );
      if (response.isSuccess && response.data) {
        return { Items: response.data.Items || [] };
      }
      return { Items: [] };
    } catch (error: any) {
      if (error.response?.data?.Message) {
        process.stderr.write(`[MCP Server] ${error.response.data.Message}\n`);
      } else {
        process.stderr.write(`[MCP Server] Error fetching email sequences: ${error.message}\n`);
      }
      return {
        Items: [],
      };
    }
  }
}
