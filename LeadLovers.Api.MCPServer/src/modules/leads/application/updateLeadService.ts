import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { Result } from 'shared/types/defaultResult';
import { UpdateLeadToolInput, UpdateLeadToolOutput } from '../presentation/schemas/updateLead';

export class UpdateLeadService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: UpdateLeadToolInput): Promise<Result<UpdateLeadToolOutput>> {
    try {
      const response = await this.leadloversApi.put<UpdateLeadToolInput, UpdateLeadToolOutput>(
        `/Lead?token=${variables.leadlovers.API_TOKEN}`,
        input
      );
      if (response.isSuccess && response.data) {
        return {
          isSuccess: true,
          message: 'Lead updated successfully',
          data: response.data as UpdateLeadToolOutput,
        };
      }
      return {
        isSuccess: false,
        message: 'Erro desconhecido ao atualizar lead',
        data: {
          StatusCode: 'ERROR',
          Message: 'Erro desconhecido ao atualizar lead',
        },
      };
    } catch (error: any) {
      let message = 'Erro desconhecido ao atualizar lead';
      if (error.response?.data?.Message) message = error.response.data.Message;
      if (error.message) message = error.message;
      process.stderr.write(`[MCP Server] Error updating lead: ${message}\n`);
      return {
        isSuccess: false,
        message,
        data: {
          StatusCode: 'ERROR',
          Message: message,
        },
      };
    }
  }
}
