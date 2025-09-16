import { GetEmailSequencesInput, getEmailSequencesSchema } from 'schemas/emailSequence';
import { LeadLoversAPIService } from 'services/leadlovers-api';
import { MCPToolResult, McpToolSchema } from 'types/mcp';
import { MessageFormatter } from '../../utils/message-formatter';
import { ZodError } from 'zod';

export const getEmailSequencesTool: McpToolSchema = {
  name: 'get_email_sequences',
  description: 'Obtém a lista de sequências de e-mail disponíveis na conta do usuário LeadLovers',
  inputSchema: {
    type: 'object',
    properties: {
      machineCode: {
        type: 'number',
        description:
          'Código da máquina para a qual as sequências de e-mail serão obtidas (obrigatório)',
      },
    },
    required: ['machineCode'],
  },
  outputSchema: {
    type: 'object',
    properties: {
      Items: {
        type: 'array',
        SequenceCode: { type: 'number', description: 'Código da sequência de e-mail' },
        SequenceName: { type: 'string', description: 'Nome da sequência de e-mail' },
      },
    },
  },
};

export async function executeGetEmailSequences(
  args: unknown,
  apiService: LeadLoversAPIService
): Promise<MCPToolResult> {
  let validatedParams: GetEmailSequencesInput;
  try {
    validatedParams = getEmailSequencesSchema.parse(args);
  } catch (error) {
    if (error instanceof ZodError) {
      return MessageFormatter.formatValidationError(error);
    }
    return MessageFormatter.formatError({
      action: 'obter sequências de email',
      cause: 'Parâmetros inválidos fornecidos',
    });
  }

  const response = await apiService.getEmailSequences({
    machineCode: validatedParams.machineCode,
  });

  // Verifica se houve algum problema na resposta
  if (!response || !response.Items) {
    return MessageFormatter.formatError({
      action: 'obter sequências de email',
      cause: 'Resposta inválida da API LeadLovers',
      suggestion: 'Verifique sua conexão e se o código da máquina está correto',
    });
  }

  // Se não há sequências
  if (response.Items.length === 0) {
    return MessageFormatter.formatSuccess({
      action: 'Busca realizada com sucesso',
      details: {
        Máquina: validatedParams.machineCode,
        Resultado: 'Nenhuma sequência de email encontrada',
      },
      contextInfo: [
        '💡 **Dica:** Crie sequências de email na sua máquina para automatizar o envio de mensagens.',
      ],
    });
  }

  // Formatar lista de sequências de forma mais legível
  const sequencesList = response.Items.map(
    (seq: any) => `• **${seq.SequenceName}** (Código: ${seq.SequenceCode})`
  );

  return MessageFormatter.formatSuccess({
    action: `${response.Items.length} sequência(s) de email encontrada(s)`,
    details: {
      Máquina: validatedParams.machineCode,
    },
    contextInfo: [
      '**Lista de Sequências:**',
      ...sequencesList,
      '\n💡 **Dica:** Use o código da sequência para criar leads diretamente nela.',
    ],
  });
}
