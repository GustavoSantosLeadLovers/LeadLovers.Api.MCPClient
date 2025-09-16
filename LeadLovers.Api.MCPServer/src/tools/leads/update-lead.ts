import { UpdateLeadInput, updateLeadSchema } from 'schemas/leads';
import { LeadLoversAPIService } from 'services/leadlovers-api';
import { MCPToolResult, McpToolSchema } from 'types/mcp';
import { MessageFormatter } from '../../utils/message-formatter';
import { ZodError } from 'zod';

export const updateLeadTool: McpToolSchema = {
  name: 'update_lead',
  description: 'Atualiza os dados de um lead existente no CRM LeadLovers com os dados fornecidos',
  inputSchema: {
    type: 'object',
    properties: {
      Name: {
        type: 'string',
        description: 'Nome completo do lead (opcional)',
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
        type: 'string',
        description: 'Código da máquina onde o lead será criado (opcional)',
        maxLength: 100,
      },
      EmailSequenceCode: {
        type: 'number',
        description: 'Código da sequência de e-mail (opcional)',
        minimum: 0,
      },
      SequenceLevelCode: {
        type: 'number',
        description: 'Código do nível da sequência de e-mail (opcional)',
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
    required: ['Email'],
  },
  outputSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', description: 'Indica se a atualização foi bem-sucedida' },
      message: { type: 'string', description: 'Mensagem de retorno' },
    },
  },
};

export async function executeUpdateLead(
  args: unknown,
  apiService: LeadLoversAPIService
): Promise<MCPToolResult> {
  let validatedData: UpdateLeadInput;

  try {
    validatedData = updateLeadSchema.parse(args);
  } catch (error) {
    if (error instanceof ZodError) {
      return MessageFormatter.formatValidationError(error);
    }
    return MessageFormatter.formatError({
      action: 'atualizar o lead',
      cause: 'Dados inválidos fornecidos',
    });
  }

  const response = await apiService.updateLead(validatedData);

  // Verifica se a API retornou erro baseado no StatusCode
  if (response.StatusCode === 'ERROR') {
    return MessageFormatter.formatApiError(response.Message, 'atualizar o lead');
  }

  // Verifica se houve algum problema na resposta
  if (!response) {
    return MessageFormatter.formatError({
      action: 'atualizar o lead',
      cause: 'Resposta inválida da API LeadLovers',
      suggestion: 'Verifique sua conexão e tente novamente',
    });
  }

  // Sucesso
  return MessageFormatter.formatSuccess({
    action: 'Lead atualizado com sucesso',
    details: {
      Email: validatedData.Email,
      Nome: validatedData.Name,
      Telefone: validatedData.Phone,
      Empresa: validatedData.Company,
      Cidade: validatedData.City,
      Estado: validatedData.State,
      Origem: validatedData.Source,
      Máquina: validatedData.MachineCode,
    },
    contextInfo: ['💡 **Dica:** As alterações foram aplicadas imediatamente no CRM LeadLovers.'],
  });
}
