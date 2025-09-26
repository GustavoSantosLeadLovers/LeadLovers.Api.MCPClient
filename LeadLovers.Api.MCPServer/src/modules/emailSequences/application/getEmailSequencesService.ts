import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { Result } from 'shared/types/defaultResult';
import {
  GetEmailSequencesToolInput,
  GetEmailSequencesToolOutput,
} from '../presentation/schemas/getEmailSequences';

export class GetEmailSequencesService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(
    input: GetEmailSequencesToolInput
  ): Promise<Result<GetEmailSequencesToolOutput>> {
    try {
      const response = await this.leadloversApi.get<any, GetEmailSequencesToolOutput>(
        `/EmailSequences?token={token}&machineCode={machineCode}`
          .replace('{token}', encodeURIComponent(variables.leadlovers.API_TOKEN || ''))
          .replace('{machineCode}', encodeURIComponent(input.machineCode.toString()))
      );
      if (response.isSuccess && response.data) {
        return {
          isSuccess: true,
          message: 'Email sequences fetched successfully',
          data: { Items: response.data.Items || [] },
        };
      }
      return {
        isSuccess: false,
        message: 'Failed to fetch email sequences',
        data: { Items: [] },
      };
    } catch (error: any) {
      let message = 'Failed to fetch email sequences';
      if (error.response?.data?.Message) message = error.response.data.Message;
      if (error.message) message = error.message;
      process.stderr.write(`[MCP Server] Error fetching email sequences: ${message}\n`);
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
