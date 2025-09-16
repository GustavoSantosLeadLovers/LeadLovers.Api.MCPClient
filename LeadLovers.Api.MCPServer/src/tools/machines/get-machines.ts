import { GetMachinesInput, getMachinesSchema } from 'schemas/machines';
import { LeadLoversAPIService } from 'services/leadlovers-api';
import { MCPToolResult, McpToolSchema } from 'types/mcp';
import { ZodError } from 'zod';
import { MessageFormatter, formatMachineSuccess } from '../../utils/message-formatter';

export const getMachinesTool: McpToolSchema = {
  name: 'get_machines',
  description: 'Obtém a lista de máquinas disponíveis na conta do usuário LeadLovers',
  inputSchema: {
    type: 'object',
    properties: {
      page: { type: 'number', description: 'Número da página para paginação (padrão: 1)' },
      registers: { type: 'number', description: 'Número de registros por página (padrão: 10)' },
      details: { type: 'number', description: 'Incluir detalhes das máquinas (0 ou 1, padrão: 0)' },
      types: { type: 'string', description: 'Tipos de máquinas a serem filtradas (opcional)' },
    },
  },
  outputSchema: {
    type: 'object',
    properties: {
      Items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            MachineCode: { type: 'number', description: 'Código da máquina' },
            MachineName: { type: 'string', description: 'Nome da máquina' },
            MachineImage: { type: 'string', description: 'URL da imagem da máquina' },
            Views: { type: 'number', description: 'Número de visualizações da máquina' },
            Leads: { type: 'number', description: 'Número de leads na máquina' },
          },
        },
      },
      CurrentPage: { type: 'number', description: 'Página atual da listagem' },
      Registers: { type: 'number', description: 'Número total de registros' },
    },
  },
};

export async function executeGetMachines(
  args: unknown,
  apiService: LeadLoversAPIService
): Promise<MCPToolResult> {
  let validatedParams: GetMachinesInput;
  try {
    validatedParams = getMachinesSchema.parse(args);
  } catch (error) {
    if (error instanceof ZodError) {
      return MessageFormatter.formatValidationError(error);
    }
    return MessageFormatter.formatError({
      action: 'obter as máquinas',
      cause: 'Parâmetros inválidos fornecidos',
    });
  }

  const machines = await apiService.getMachines(validatedParams);

  // Verifica se houve algum problema na resposta
  if (!machines || !machines.Items) {
    return MessageFormatter.formatError({
      action: 'obter a lista de máquinas',
      cause: 'Resposta inválida da API LeadLovers ou nenhuma máquina encontrada',
      suggestion: 'Verifique sua conexão e permissões na conta LeadLovers',
    });
  }

  // Se não há máquinas
  if (machines.Items.length === 0) {
    return MessageFormatter.formatSuccess({
      action: 'Busca realizada com sucesso',
      details: {
        Página: validatedParams.page || 1,
        Resultado: 'Nenhuma máquina encontrada',
      },
      contextInfo: [
        '💡 **Dica:** Verifique se você possui máquinas criadas em sua conta LeadLovers.',
      ],
    });
  }

  // Usar helper específico para máquinas
  return formatMachineSuccess(machines.Items, machines.Registers || machines.Items.length);
}
