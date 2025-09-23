import { GetLeadsInput, getLeadsSchema } from 'schemas/leads';
import { LeadLoversAPIService } from 'services/leadlovers-api';
import { Lead } from 'types/leadlovers';
import { MCPToolResult, McpToolSchema } from 'types/mcp';
import { ZodError } from 'zod';
import { MessageFormatter } from '../../utils/message-formatter';

export const getLeadsTool: McpToolSchema = {
  name: 'get_leads',
  description: 'Recupera uma lista de leads com base nos parâmetros fornecidos',
  inputSchema: {
    type: 'object',
    properties: {
      page: {
        type: 'number',
        description: 'Número da página para paginação, começando em 1',
        minimum: 1,
      },
      startDate: {
        type: 'string',
        description: 'Data de início do cadastro do lead (AAAA-MM-DD)',
        format: 'date',
      },
      endDate: {
        type: 'string',
        description: 'Data de término do cadastro do lead (AAAA-MM-DD)',
        format: 'date',
      },
    },
    required: ['page'],
  },
  // outputSchema: {
  //   type: 'object',
  //   properties: {
  //     Data: {
  //       type: 'array',
  //       Email: { type: 'string' },
  //       Name: { type: 'string' },
  //       Company: { type: 'string' },
  //       Phone: { type: 'string' },
  //       Photo: { type: 'string' },
  //       City: { type: 'string' },
  //       State: { type: 'string' },
  //       Birthday: { type: 'string' },
  //       Gender: { type: 'string' },
  //       Score: { type: 'number' },
  //       RegistrationDate: { type: 'string' },
  //     },
  //     Links: {
  //       Self: { type: 'string', description: 'Link para a página atual' },
  //       Next: { type: 'string', description: 'Link para a próxima página' },
  //       Prev: { type: 'string', description: 'Link para a página anterior' },
  //     },
  //   },
  // },
};

export async function executeGetLeads(
  args: unknown,
  apiService: LeadLoversAPIService
): Promise<MCPToolResult> {
  let validatedParams: GetLeadsInput;
  try {
    validatedParams = getLeadsSchema.parse(args);
  } catch (error) {
    if (error instanceof ZodError) {
      return MessageFormatter.formatValidationError(error);
    }
    return MessageFormatter.formatError({
      action: 'obter os leads',
      cause: 'Parâmetros inválidos fornecidos',
    });
  }

  const response = await apiService.getLeads(validatedParams);

  // Verifica se houve algum problema na resposta
  if (!response || !response.Data) {
    return MessageFormatter.formatError({
      action: 'obter os leads',
      cause: 'Nenhum lead encontrado ou resposta inválida da API',
      suggestion: 'Verifique os parâmetros de busca ou tente uma página diferente',
    });
  }

  // Se não há leads, mas a resposta é válida
  if (response.Data.length === 0) {
    return MessageFormatter.formatSuccess({
      action: 'Busca realizada com sucesso',
      details: {
        Página: validatedParams.page,
        Período:
          validatedParams.startDate && validatedParams.endDate
            ? `${validatedParams.startDate} a ${validatedParams.endDate}`
            : 'Todos os períodos',
        Resultado: '0 leads encontrados',
      },
      contextInfo: ['💡 **Dica:** Tente ajustar o período de busca ou verificar outras páginas.'],
    });
  }

  // Formatar lista de leads de forma mais legível
  const leadsList = response.Data.map((lead: Lead) => {
    const parts: string[] = [];
    if (lead.Name) parts.push(`**${lead.Name}**`);
    if (lead.Email) parts.push(`📧 ${lead.Email}`);
    if (lead.Company) parts.push(`🏢 ${lead.Company}`);
    if (lead.Phone) parts.push(`📞 ${lead.Phone}`);
    if (lead.City && lead.State) parts.push(`🗺 ${lead.City}/${lead.State}`);
    if (lead.Birthday) parts.push(`🎂 ${lead.Birthday}`);
    if (lead.Gender) parts.push(`🚻 ${lead.Gender}`);
    if (lead.Score) parts.push(`🏆 ${lead.Score}`);
    if (lead.RegistrationDate) parts.push(`📅 ${lead.RegistrationDate}`);

    return `• ${parts.join(' | ')}`;
  });

  return MessageFormatter.formatSuccess({
    action: `${response.Data.length} leads encontrados`,
    details: {
      Página: validatedParams.page,
      Período:
        validatedParams.startDate && validatedParams.endDate
          ? `${validatedParams.startDate} a ${validatedParams.endDate}`
          : 'Todos os períodos',
    },
    contextInfo: [
      '**Lista de Leads:**',
      ...leadsList,
      response.Links?.Next
        ? '\n👉 **Dica:** Use `page: ${validatedParams.page + 1}` para ver mais leads.'
        : '',
    ],
  });
}
