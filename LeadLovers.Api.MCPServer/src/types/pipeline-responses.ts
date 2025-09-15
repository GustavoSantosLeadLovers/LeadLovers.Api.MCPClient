/**
 * Response interfaces for LeadLovers Pipeline API endpoints
 */

export interface MoveCardResponse {
  card: PipelineCard;
}

export interface PipelineCard {
  Id: number;
  Responsible: number;
  SubUserResponsible: number | null;
  ColumnId: number;
  LeadCodi: number;
  LeadName: string;
  LeadEmail: string;
  LeadPhone: string;
  LeadCommercialPhone: string | null;
  LeadTags: string;
  ResponsibleUserName: string;
  ResponsibleUserEmail: string;
  ResponsibleSubUserName: string | null;
  ResponsibleSubUserEmail: string | null;
  LeadScore: number;
  Value: number;
  Position: number;
  DealStatus: number;
  DealScheduleDate: string | null;
  ScheduleStatus: number;
  DealEarnedDate: string | null;
  CreateDate: string; // Format: "/Date(timestamp)/"
  UpdateDate: string; // Format: "/Date(timestamp)/"
  Status: number;
  Annotations: any[];
  Tags: any[] | null;
  Histories: any[] | null;
  IsNew: boolean;
  HasLeadReference: boolean;
  ResponsibleName: string;
  ResponsibleEmail: string;
  CurrentLeadEmail: string;
  DealStatusText: string;
  CardStatusText: string;
  Notifications: boolean;
  SchedulingReminder_DayToSend: string | null;
  DealStatusMotive: string | null;
}

/**
 * Normalized card data for MCP responses
 */
export interface NormalizedPipelineCard {
  id: number;
  leadId: number;
  lead: {
    name: string;
    email: string;
    phone: string;
    commercialPhone: string | null;
    tags: string[];
    score: number;
  };
  column: {
    id: number;
  };
  responsible: {
    id: number;
    name: string;
    email: string;
  };
  subUserResponsible: {
    id: number | null;
    name: string | null;
    email: string | null;
  };
  deal: {
    status: number;
    statusText: string;
    value: number;
    scheduleDate: Date | null;
    earnedDate: Date | null;
    motive: string | null;
  };
  card: {
    status: number;
    statusText: string;
    position: number;
    isNew: boolean;
    hasLeadReference: boolean;
    notifications: boolean;
  };
  dates: {
    created: Date;
    updated: Date;
  };
  scheduling: {
    status: number;
    reminderDayToSend: string | null;
  };
  metadata: {
    annotations: any[];
    tags: any[] | null;
    histories: any[] | null;
  };
}

/**
 * MCP response for move card operation
 */
export interface MoveCardMCPResponse {
  success: boolean;
  message: string;
  card: NormalizedPipelineCard;
  summary: {
    leadName: string;
    leadEmail: string;
    movedToColumn: number;
    dealStatus: string;
    responsibleName: string;
    cardValue: number;
  };
}
