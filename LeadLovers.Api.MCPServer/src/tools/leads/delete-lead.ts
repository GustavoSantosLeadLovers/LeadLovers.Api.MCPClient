import { DeleteLeadInput, deleteLeadSchema } from 'schemas/leads';
import { LeadLoversAPIService } from 'services/leadlovers-api';
import { MCPToolResult, McpToolSchema } from 'types/mcp';
import { MessageFormatter } from '../../utils/message-formatter';
import { ZodError } from 'zod';

export const deleteLeadTool: McpToolSchema = {
  name: 'deleteLead',
  description:
    'Deleta um lead do funil e sequência de e-mails na LeadLovers, não deleta o lead da máquina.',
  inputSchema: {
    type: 'object',
    properties: {
      machineCode: {
        type: 'number',
        description:
          'Código da máquina para localizar a sequência da qual o lead será removido (obrigatório)',
      },
      sequenceCode: { type: 'number', description: 'Código da sequência de e-mail (obrigatório)' },
      phone: { type: 'string', description: 'Telefone do lead (opcional)', maxLength: 100 },
      email: { type: 'string', description: 'E-mail do lead (opcional)', maxLength: 100 },
    },
    required: ['machineCode', 'sequenceCode'],
  },
  outputSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', description: 'Indica se a operação foi bem-sucedida' },
      message: { type: 'string', description: 'Mensagem detalhada sobre o resultado da operação' },
      details: { type: 'object', description: 'Detalhes adicionais sobre o lead deletado' },
      contextInfo: {
        type: 'array',
        items: { type: 'string' },
        description: 'Informações contextuais adicionais sobre a operação',
      },
    },
  },
};

export async function executeDeleteLead(
  args: unknown,
  apiService: LeadLoversAPIService
): Promise<MCPToolResult> {
  let validatedParams: DeleteLeadInput;
  try {
    validatedParams = deleteLeadSchema.parse(args);
  } catch (error) {
    if (error instanceof ZodError) {
      return MessageFormatter.formatValidationError(error);
    }
    return MessageFormatter.formatError({
      action: 'deletar o lead',
      cause: 'Dados inválidos fornecidos',
    });
  }

  const response = await apiService.deleteLead(validatedParams);

  // Verifica se a API retornou erro
  if (MessageFormatter.isApiError(response)) {
    return MessageFormatter.formatApiError(response.Message, 'deletar o lead');
  }

  // Verifica se houve algum problema na resposta
  if (!response || !response.Message) {
    return MessageFormatter.formatError({
      action: 'deletar o lead',
      cause: 'Resposta inválida da API LeadLovers',
      suggestion: 'Verifique sua conexão e tente novamente',
    });
  }

  // Sucesso
  return MessageFormatter.formatSuccess({
    action: 'Lead deletado com sucesso',
    details: {
      Máquina: validatedParams.machineCode,
      Sequência: validatedParams.sequenceCode,
      Email: validatedParams.email || 'não informado',
      Telefone: validatedParams.phone || 'não informado',
    },
    contextInfo: ['O lead foi removido do funil e sequência de emails.'],
  });
}
