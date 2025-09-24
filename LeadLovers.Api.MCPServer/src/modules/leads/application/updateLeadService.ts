import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { UpdateLeadToolInput, UpdateLeadToolOutput } from '../presentation/schemas/updateLead';

export class UpdateLeadService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: UpdateLeadToolInput): Promise<UpdateLeadToolOutput> {
    try {
      const response = await this.leadloversApi.put(
        `/Lead?token=${variables.leadlovers.API_TOKEN}`,
        input
      );
      if (response.isSuccess && response.data) {
        return response.data;
      }
      return {
        StatusCode: 'ERROR',
        Message: 'Erro desconhecido ao atualizar lead',
      };
    } catch (error: any) {
      if (error.response?.data?.Message) {
        return {
          StatusCode: 'ERROR',
          Message: error.response.data.Message,
        };
      }

      return {
        StatusCode: 'ERROR',
        Message: 'Erro desconhecido ao atualizar lead',
      };
    }
  }
}
