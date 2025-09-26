import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { Result } from 'shared/types/defaultResult';
import { CreateLeadToolInput, CreateLeadToolOutput } from '../presentation/schemas/createLead';

export class CreateLeadService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: CreateLeadToolInput): Promise<Result<CreateLeadToolOutput>> {
    try {
      const response = await this.leadloversApi.post<CreateLeadToolInput, CreateLeadToolOutput>(
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
            isSuccess: false,
            message: `Erro ao criar lead: ${message}`,
            data: {
              Message: `Erro ao criar lead: ${message}`,
            },
          };
        }
        return {
          isSuccess: true,
          message: 'Lead created successfully',
          data: {
            Message: message,
          },
        };
      }
      return {
        isSuccess: false,
        message: 'Erro desconhecido ao criar lead',
        data: { Message: 'Erro desconhecido ao criar lead' },
      };
    } catch (error: any) {
      let message = 'Erro desconhecido ao criar lead';
      if (error.response?.data?.Message) message = error.response.data.Message;
      if (error.message) message = error.message;
      process.stderr.write(`[MCP Server] Error creating lead: ${message}\n`);
      return {
        isSuccess: false,
        message,
        data: { Message: message },
      };
    }
  }
}
