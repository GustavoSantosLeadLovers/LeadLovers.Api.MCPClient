import {
  MoveCardResponse,
  PipelineCard,
  NormalizedPipelineCard,
  MoveCardMCPResponse,
} from '../types/pipeline-responses';

/**
 * Utility functions for normalizing LeadLovers Pipeline API responses
 */

/**
 * Converts LeadLovers date format "/Date(timestamp)/" to JavaScript Date
 */

// TODO: Pensar em mover para utils/data.ts
// TODO: Adicionar testes unitários
export function parseLeadLoversDate(dateString: string): Date {
  if (!dateString) {
    throw new Error('Invalid date string');
  }

  const match = dateString.match(/\/Date\((\d+)\)\//);
  if (!match) {
    throw new Error(`Invalid LeadLovers date format: ${dateString}`);
  }

  const timestamp = parseInt(match[1], 10);
  return new Date(timestamp);
}

/**
 * Parses lead tags from string format to array
 */
export function parseLeadTags(tagsString: string): string[] {
  if (!tagsString || tagsString.trim() === '') {
    return [];
  }

  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');
}

/**
 * Normalizes a PipelineCard from LeadLovers API to MCP format
 */
export function normalizePipelineCard(card: PipelineCard): NormalizedPipelineCard {
  return {
    id: card.Id,
    leadId: card.LeadCodi,
    lead: {
      name: card.LeadName,
      email: card.LeadEmail,
      phone: card.LeadPhone,
      commercialPhone: card.LeadCommercialPhone,
      tags: parseLeadTags(card.LeadTags),
      score: card.LeadScore,
    },
    column: {
      id: card.ColumnId,
    },
    responsible: {
      id: card.Responsible,
      name: card.ResponsibleUserName || card.ResponsibleName,
      email: card.ResponsibleUserEmail || card.ResponsibleEmail,
    },
    subUserResponsible: {
      id: card.SubUserResponsible,
      name: card.ResponsibleSubUserName,
      email: card.ResponsibleSubUserEmail,
    },
    deal: {
      status: card.DealStatus,
      statusText: card.DealStatusText,
      value: card.Value,
      scheduleDate: card.DealScheduleDate ? parseLeadLoversDate(card.DealScheduleDate) : null,
      earnedDate: card.DealEarnedDate ? parseLeadLoversDate(card.DealEarnedDate) : null,
      motive: card.DealStatusMotive,
    },
    card: {
      status: card.Status,
      statusText: card.CardStatusText,
      position: card.Position,
      isNew: card.IsNew,
      hasLeadReference: card.HasLeadReference,
      notifications: card.Notifications,
    },
    dates: {
      created: parseLeadLoversDate(card.CreateDate),
      updated: parseLeadLoversDate(card.UpdateDate),
    },
    scheduling: {
      status: card.ScheduleStatus,
      reminderDayToSend: card.SchedulingReminder_DayToSend,
    },
    metadata: {
      annotations: card.Annotations || [],
      tags: card.Tags,
      histories: card.Histories,
    },
  };
}

/**
 * Creates a user-friendly MCP response for move card operation
 */
export function createMoveCardMCPResponse(
  apiResponse: MoveCardResponse,
  success: boolean = true,
  customMessage?: string
): MoveCardMCPResponse {
  const normalizedCard = normalizePipelineCard(apiResponse.card);

  const defaultMessage = success
    ? `Card movido com sucesso! ${normalizedCard.lead.name} foi movido para a coluna ${normalizedCard.column.id}.`
    : 'Falha ao mover o card.';

  return {
    success,
    message: customMessage || defaultMessage,
    card: normalizedCard,
    summary: {
      leadName: normalizedCard.lead.name,
      leadEmail: normalizedCard.lead.email,
      movedToColumn: normalizedCard.column.id,
      dealStatus: normalizedCard.deal.statusText,
      responsibleName: normalizedCard.responsible.name,
      cardValue: normalizedCard.deal.value,
    },
  };
}

/**
 * Creates a detailed user feedback message for move card operation
 */
export function createMoveCardFeedback(response: MoveCardMCPResponse): string {
  const { card, summary } = response;

  if (!response.success) {
    return `❌ Erro ao mover card: ${response.message}`;
  }

  const lines = [
    `✅ **Card movido com sucesso!**`,
    ``,
    `**Lead:** ${summary.leadName} (${summary.leadEmail})`,
    `**Movido para coluna:** ${summary.movedToColumn}`,
    `**Status do negócio:** ${summary.dealStatus}`,
    `**Responsável:** ${summary.responsibleName}`,
    `**Valor:** R$ ${summary.cardValue.toFixed(2)}`,
    `**Score do lead:** ${card.lead.score}`,
    ``,
    `**Detalhes técnicos:**`,
    `- Card ID: ${card.id}`,
    `- Lead ID: ${card.leadId}`,
    `- Posição: ${card.card.position}`,
    `- Status do card: ${card.card.statusText}`,
    `- Atualizado em: ${card.dates.updated.toLocaleString('pt-BR')}`,
  ];

  if (card.lead.tags.length > 0) {
    lines.push(`- Tags: ${card.lead.tags.join(', ')}`);
  }

  if (card.deal.scheduleDate) {
    lines.push(`- Data agendada: ${card.deal.scheduleDate.toLocaleString('pt-BR')}`);
  }

  if (card.subUserResponsible.name) {
    lines.push(`- Sub-usuário responsável: ${card.subUserResponsible.name}`);
  }

  return lines.join('\n');
}
