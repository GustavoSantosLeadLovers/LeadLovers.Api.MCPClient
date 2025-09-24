import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { DeleteLeadToolInput, DeleteLeadToolOutput } from '../presentation/schemas/deleteLead';

export class DeleteLeadService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: DeleteLeadToolInput): Promise<DeleteLeadToolOutput> {
    try {
      const response = await this.leadloversApi.delete(
        `/Lead/Funnel?token={token}&machineCode={machineCode}&sequenceCode={sequenceCode}&${input.email ? `email={email}&` : ''}${input.phone ? `phone={phone}` : ''}`
          .replace('{token}', encodeURIComponent(variables.leadlovers.API_TOKEN))
          .replace('{machineCode}', encodeURIComponent(input.machineCode.toString()))
          .replace('{sequenceCode}', encodeURIComponent(input.sequenceCode.toString()))
          .replace('{email}', encodeURIComponent(input.email || ''))
          .replace('{phone}', encodeURIComponent(input.phone || ''))
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
            Message: `Erro ao deletar lead: ${message}`,
          };
        }
        return {
          Message: message,
        };
      }
      return { Message: 'Erro desconhecido ao deletar lead' };
    } catch (error: any) {
      if (error.response?.data?.Message) {
        return { Message: error.response.data.Message };
      }
      return { Message: 'Erro desconhecido ao deletar lead' };
    }
  }
}
