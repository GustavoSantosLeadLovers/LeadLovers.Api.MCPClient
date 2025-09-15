import { LeadLoversAPIService } from 'services/leadlovers-api';
import { CreateLeadInput, createLeadSchema } from '../../schemas/leads';
import { MCPToolResult, McpToolSchema } from '../../types/mcp';
import { MessageFormatter, formatLeadSuccess } from '../../utils/message-formatter';
import { ZodError } from 'zod';

export const createLeadTool: McpToolSchema = {
  name: 'create_lead',
  description: 'Cria um novo lead no CRM LeadLovers com os dados fornecidos',
  inputSchema: {
    type: 'object',
    properties: {
      Name: {
        type: 'string',
        description: 'Nome completo do lead (obrigatório)',
        minLength: 2,
        maxLength: 100,
      },
      Email: {
        type: 'string',
        description: 'E-mail do lead (obrigatório)',
        format: 'email',
        maxLength: 100,
      },
      MachineCode: {
        type: 'number',
        description: 'Código da máquina onde o lead será criado (obrigatório)',
        minimum: 0,
      },
      EmailSequenceCode: {
        type: 'number',
        description: 'Código da sequência de e-mail (obrigatório)',
        minimum: 0,
      },
      SequenceLevelCode: {
        type: 'number',
        description: 'Código do nível da sequência de e-mail (obrigatório)',
        minimum: 0,
      },
      Company: {
        type: 'string',
        description: 'Empresa do lead (opcional)',
        maxLength: 100,
      },
      Phone: {
        type: 'string',
        description: 'Telefone do lead (opcional)',
        maxLength: 100,
      },
      Photo: {
        type: 'string',
        description: 'URL da foto (opcional)',
        maxLength: 100,
      },
      City: {
        type: 'string',
        description: 'Cidade (opcional)',
        maxLength: 100,
      },
      State: {
        type: 'string',
        description: 'Estado (opcional)',
        maxLength: 100,
      },
      Birthday: {
        type: 'string',
        description: 'Data de nascimento (opcional)',
        maxLength: 100,
      },
      Gender: {
        type: 'string',
        description: 'Gênero (opcional)',
        maxLength: 100,
      },
      Score: {
        type: 'number',
        description: 'Pontuação do lead (opcional)',
        minimum: 0,
      },
      Tag: {
        type: 'number',
        description: 'Tag ID (opcional)',
        minimum: 0,
      },
      Source: {
        type: 'string',
        description: 'Origem do lead (opcional)',
        maxLength: 100,
      },
      Message: {
        type: 'string',
        description: 'Mensagem (opcional)',
        maxLength: 100,
      },
      Notes: {
        type: 'string',
        description: 'Notas sobre o lead (opcional)',
        maxLength: 100,
      },
    },
    required: ['Name', 'Email', 'MachineCode', 'EmailSequenceCode', 'SequenceLevelCode'],
  },
  outputSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', description: 'Indica se a operação foi bem-sucedida' },
      action: { type: 'string', description: 'Ação realizada' },
      details: {
        type: 'object',
        description: 'Detalhes adicionais sobre o lead criado',
      },
      contextInfo: {
        type: 'array',
        items: { type: 'string' },
        description: 'Informações contextuais adicionais sobre a operação',
      },
    },
  },
};

export async function executeCreateLead(
  args: unknown,
  apiService: LeadLoversAPIService
): Promise<MCPToolResult> {
  let validatedData: CreateLeadInput;
  try {
    validatedData = createLeadSchema.parse(args);
  } catch (error) {
    if (error instanceof ZodError) {
      return MessageFormatter.formatValidationError(error);
    }
    return MessageFormatter.formatError({
      action: 'criar o lead',
      cause: 'Dados inválidos fornecidos',
    });
  }

  const newLead = await apiService.createLead(validatedData);

  // Verifica se a API retornou erro
  if (MessageFormatter.isApiError(newLead)) {
    return MessageFormatter.formatApiError(newLead.Message, 'criar o lead');
  }

  // Verifica se houve algum problema na resposta
  if (!newLead || !newLead.Message) {
    return MessageFormatter.formatError({
      action: 'criar o lead',
      cause: 'Resposta inválida da API LeadLovers',
      suggestion: 'Verifique sua conexão e tente novamente',
    });
  }

  // Sucesso - usando helper específico para leads
  return MessageFormatter.formatSuccess({
    action: `Lead criado com sucesso${validatedData.MachineCode ? ` na máquina ${validatedData.MachineCode}` : ''}`,
    details: {
      ID: newLead.Message,
      Nome: validatedData.Name,
      Email: validatedData.Email,
      Telefone: validatedData.Phone,
      Empresa: validatedData.Company,
      Origem: validatedData.Source,
      Máquina: validatedData.MachineCode,
      Sequência: validatedData.EmailSequenceCode,
    },
    contextInfo: [
      '💡 **Dica:** O lead foi adicionado à sequência de emails e receberá as mensagens automaticamente.',
    ],
  });
}
