import { variables } from 'shared/configs/variables';
import { ILeadLoversAPIProvider } from 'shared/providers/LeadloversAPI/interfaces/leadloversAPIProvider';
import { Result } from 'shared/types/defaultResult';
import { DeleteLeadToolInput, DeleteLeadToolOutput } from '../presentation/schemas/deleteLead';

export class DeleteLeadService {
  constructor(private readonly leadloversApi: ILeadLoversAPIProvider) {}

  public async execute(input: DeleteLeadToolInput): Promise<Result<DeleteLeadToolOutput>> {
    try {
      const response = await this.leadloversApi.delete<any, DeleteLeadToolOutput>(
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
            isSuccess: false,
            message: `Erro ao deletar lead: ${message}`,
            data: {
              Message: `Erro ao deletar lead: ${message}`,
            },
          };
        }
        return {
          isSuccess: true,
          message: 'Lead deleted successfully',
          data: {
            Message: message,
          },
        };
      }
      return {
        isSuccess: false,
        message: 'Erro desconhecido ao deletar lead',
        data: { Message: 'Erro desconhecido ao deletar lead' },
      };
    } catch (error: any) {
      let message = 'Erro desconhecido ao deletar lead';
      if (error.response?.data?.Message) message = error.response.data.Message;
      if (error.message) message = error.message;
      process.stderr.write(`[MCP Server] Error deleting lead: ${message}\n`);
      return {
        isSuccess: false,
        message,
        data: { Message: message },
      };
    }
  }
}
