import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { CreateLeadToolInput, CreateLeadToolOutput } from '../presentation/schemas/createLead';

export class CreateLeadService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: CreateLeadToolInput): Promise<CreateLeadToolOutput> {
    try {
      const response = await this.leadloversApi.post(
        `/Lead?token=${variables.leadlovers.API_TOKEN}`,
        input
      );
      if (response.isSuccess && response.data?.Message) {
        const message = response.data.Message;
        if (
          message.toLowerCase().includes('erro') ||
          message.toLowerCase().includes('error') ||
          message.toLowerCase().includes('falha') ||
          message.toLowerCase().includes('inválido')
        ) {
          return {
            Message: `Erro ao criar lead: ${message}`,
          };
        }
        return {
          Message: message,
        };
      }
      return { Message: 'Erro desconhecido ao criar lead' };
    } catch (error: any) {
      if (error.response?.data?.Message) {
        return { Message: error.response.data.Message };
      }
      return { Message: 'Erro desconhecido ao criar lead' };
    }
  }
}
