/*
exemple of a response:
"Items": [
{
"MachineCode": 42850,
"MachineName": "Get thin with Dr. Rocha V1",
"MachineImage": "https://blob.contato.io/some_image.jpg",
"Views": 0,
"Leads": 1
},
{}
],
"CurrentPage": 0,
"Registers": 0

*/

import { GetMachineDetailsInput, getMachineDetailsSchema } from 'schemas/machines';
import { LeadLoversAPIService } from 'services/leadlovers-api';
import { MCPToolResult, McpToolSchema } from 'types/mcp';
import { MessageFormatter } from '../../utils/message-formatter';
import { ZodError } from 'zod';

export const getMachineDetailsTool: McpToolSchema = {
  name: 'get_machine_details',
  description: 'Obtém os detalhes de uma máquina específica na conta do usuário LeadLovers',
  inputSchema: {
    type: 'object',
    properties: {
      machineCode: { type: 'number', description: 'Código da máquina' },
    },
    required: ['machineCode'],
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

export async function executeGetMachineDetails(
  args: unknown,
  apiService: LeadLoversAPIService
): Promise<MCPToolResult> {
  let validatedParams: GetMachineDetailsInput;
  try {
    validatedParams = getMachineDetailsSchema.parse(args);
  } catch (error) {
    if (error instanceof ZodError) {
      return MessageFormatter.formatValidationError(error);
    }
    return MessageFormatter.formatError({
      action: 'obter detalhes da máquina',
      cause: 'Parâmetros inválidos fornecidos',
    });
  }

  const machines = await apiService.getMachineDetails(validatedParams.machineCode);

  // Verifica se houve algum problema na resposta
  if (!machines || !machines.Items) {
    return MessageFormatter.formatError({
      action: 'obter detalhes da máquina',
      cause: 'Resposta inválida da API LeadLovers',
      suggestion: 'Verifique sua conexão e se o código da máquina está correto',
    });
  }

  // Se não encontrou a máquina
  if (!Array.isArray(machines.Items) || machines.Items.length === 0) {
    return MessageFormatter.formatError({
      action: 'obter detalhes da máquina',
      cause: `Máquina com código ${validatedParams.machineCode} não encontrada`,
      suggestion: 'Verifique se o código da máquina está correto e se ela existe em sua conta',
    });
  }

  const machine = machines.Items[0];

  // Sucesso
  return MessageFormatter.formatSuccess({
    action: `Detalhes da máquina ${validatedParams.machineCode}`,
    details: {
      Nome: machine.MachineName || 'Não informado',
      Código: machine.MachineCode || 'Não informado',
      Visualizações: machine.Views || 0,
      Leads: machine.Leads || 0,
      Imagem: machine.MachineImage ? `${machine.MachineImage}` : 'Não informado',
    },
    contextInfo: ['💡 **Dica:** Use este código de máquina para criar ou gerenciar leads.'],
  });
}
