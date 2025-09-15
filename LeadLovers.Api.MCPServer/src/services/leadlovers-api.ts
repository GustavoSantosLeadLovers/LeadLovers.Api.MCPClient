import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { GetEmailSequencesInput } from 'schemas/emailSequence';
import { GetMachinesInput } from 'schemas/machines';
import type {
  ApiResponse,
  CreateLeadResponse,
  DeleteLeadResponse,
  GetLeadsResponse,
  GetMachineDetailsResponse,
  GetMachinesResponse,
  GetSequenceEmailsResponse,
  UpdateLeadResponse,
} from 'types/leadlovers';
import type {
  CreateLeadInput,
  DeleteLeadInput,
  GetLeadsInput,
  UpdateLeadInput,
} from '../schemas/leads';
import { appConfig } from '../server/config';

export class LeadLoversAPIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: appConfig.LEADLOVERS_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `leadlovers-mcp/${appConfig.MCP_SERVER_VERSION}`,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      async config => {
        try {
          if (
            appConfig.LEADLOVERS_API_TOKEN &&
            appConfig.LEADLOVERS_API_TOKEN !== 'your_leadlovers_api_token_here'
          ) {
            config.headers.Authorization = `Bearer ${appConfig.LEADLOVERS_API_TOKEN}`;
          } else {
            process.stderr.write('[LeadLovers API] No API token configured - requests may fail\n');
          }
          return config;
        } catch (error) {
          return config;
        }
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - lida com erros de autenticação
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      async error => {
        // Log apenas erros importantes
        if (error.response?.status === 401) {
          process.stderr.write(
            '[LeadLovers API] Authentication error (401) - please check your API token\n'
          );
        } else if (error.response?.status >= 500) {
          process.stderr.write(`[LeadLovers API] Server error: ${error.response.status}\n`);
        }

        return Promise.reject(error);
      }
    );
  }

  async getLeads(params: GetLeadsInput): Promise<GetLeadsResponse> {
    try {
      const response = await this.api.get(
        `/Leads?token={token}&page={page}&startDate={startDate}&endDate={endDate}`
          .replace('{token}', encodeURIComponent(appConfig.LEADLOVERS_API_TOKEN || ''))
          .replace('{page}', encodeURIComponent((params.page || 0).toString()))
          .replace('{startDate}', encodeURIComponent(params.startDate ? params.startDate : ''))
          .replace('{endDate}', encodeURIComponent(params.endDate ? params.endDate : ''))
      );

      // Debug: Log response structure
      process.stderr.write(`[Debug] getLeads response status: ${response.status}\n`);
      process.stderr.write(`[Debug] getLeads response data: ${JSON.stringify(response.data)}\n`);

      if (response.status === 200 && response.data) {
        return response.data;
      }

      return {
        Data: [],
        Links: {
          Self: null,
          Next: null,
          Prev: null,
        },
      };
    } catch (error: any) {
      // Handle JSON parsing errors specifically
      if (error.message && error.message.includes('JSON')) {
        process.stderr.write(`[LeadLovers API] JSON parsing error in getLeads: ${error.message}\n`);
        process.stderr.write(
          `[LeadLovers API] Raw response might be malformed HTML or text instead of JSON\n`
        );

        return {
          Data: [],
          Links: {
            Self: null,
            Next: null,
            Prev: null,
          },
        };
      }

      if (error.response?.data?.Message) {
        process.stderr.write(`[LeadLovers API] ${error.response.data.Message}\n`);

        return {
          Data: [],
          Links: {
            Self: null,
            Next: null,
            Prev: null,
          },
        };
      }

      // Log genérico para outros erros
      process.stderr.write(`[LeadLovers API] Error fetching leads: ${error.message}\n`);

      return {
        Data: [],
        Links: {
          Self: null,
          Next: null,
          Prev: null,
        },
      };
    }
  }

  async createLead(leadData: CreateLeadInput): Promise<CreateLeadResponse> {
    try {
      const response = await this.api.post<CreateLeadResponse>(
        `/Lead?token=${appConfig.LEADLOVERS_API_TOKEN}`,
        leadData
      );

      if (response.status === 200 && response.data?.Message) {
        const message = response.data.Message;

        if (
          message.toLowerCase().includes('erro') ||
          message.toLowerCase().includes('error') ||
          message.toLowerCase().includes('falha') ||
          message.toLowerCase().includes('inválido')
        ) {
          return {
            Message: `Erro ao criar lead: ${message}`,
          };
        }

        return {
          Message: message,
        };
      }

      return { Message: 'Erro desconhecido ao criar lead' };
    } catch (error: any) {
      if (error.response?.data?.Message) {
        return { Message: error.response.data.Message };
      }

      return { Message: 'Erro desconhecido ao criar lead' };
    }
  }

  // TODO: Refatorar para tratar mensagens de erro de forma consistente, devido a mudanças de response vind da api.
  async updateLead(leadData: UpdateLeadInput): Promise<UpdateLeadResponse> {
    try {
      const response = await this.api.put<UpdateLeadResponse>(
        `/Lead?token=${appConfig.LEADLOVERS_API_TOKEN}`,
        leadData
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }

      return {
        StatusCode: 'ERROR',
        Message: 'Erro desconhecido ao atualizar lead',
      };
    } catch (error: any) {
      if (error.response?.data?.Message) {
        return {
          StatusCode: 'ERROR',
          Message: error.response.data.Message,
        };
      }

      return {
        StatusCode: 'ERROR',
        Message: 'Erro desconhecido ao atualizar lead',
      };
    }
  }

  async deleteLead(leadData: DeleteLeadInput): Promise<DeleteLeadResponse> {
    try {
      const response = await this.api.delete<DeleteLeadResponse>(
        `/Lead/Funnel?token={token}&machineCode={machineCode}&sequenceCode={sequenceCode}&${leadData.email ? `email={email}&` : ''}${leadData.phone ? `phone={phone}` : ''}`
          .replace('{token}', encodeURIComponent(appConfig.LEADLOVERS_API_TOKEN || ''))
          .replace('{machineCode}', encodeURIComponent(leadData.machineCode.toString()))
          .replace('{sequenceCode}', encodeURIComponent(leadData.sequenceCode.toString()))
          .replace('{email}', encodeURIComponent(leadData.email || ''))
          .replace('{phone}', encodeURIComponent(leadData.phone || ''))
      );

      if (response.status === 200 && response.data?.Message) {
        const message = response.data.Message;

        if (
          message.toLowerCase().includes('erro') ||
          message.toLowerCase().includes('error') ||
          message.toLowerCase().includes('falha') ||
          message.toLowerCase().includes('inválido')
        ) {
          return {
            Message: `Erro ao deletar lead: ${message}`,
          };
        }

        return {
          Message: message,
        };
      }

      return { Message: 'Erro desconhecido ao deletar lead' };
    } catch (error: any) {
      if (error.response?.data?.Message) {
        return { Message: error.response.data.Message };
      }

      return { Message: 'Erro desconhecido ao deletar lead' };
    }
  }

  async getMachines(params: GetMachinesInput): Promise<GetMachinesResponse> {
    try {
      const response = await this.api.get<GetMachinesResponse>(
        `/Machines?token={token}&page={page}&registers={registers}&details={details}&types={types}`
          .replace('{token}', encodeURIComponent(appConfig.LEADLOVERS_API_TOKEN || ''))
          .replace('{page}', encodeURIComponent((params.page || 0).toString()))
          .replace('{registers}', encodeURIComponent((params.registers || 10).toString()))
          .replace('{details}', encodeURIComponent((params.details || 0).toString()))
          .replace('{types}', encodeURIComponent(params.types || ''))
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }

      return {
        Items: [],
        CurrentPage: 0,
        Registers: 0,
      };
    } catch (error: any) {
      if (error.response?.data?.Message) {
        process.stderr.write(`[LeadLovers API] ${error.response.data.Message}\n`);

        return {
          Items: [],
          CurrentPage: 0,
          Registers: 0,
        };
      }

      // Log genérico para outros erros
      process.stderr.write(`[LeadLovers API] Error fetching machines: ${error.message}\n`);

      return {
        Items: [],
        CurrentPage: 0,
        Registers: 0,
      };
    }
  }

  async getMachineDetails(machineCode: number): Promise<GetMachineDetailsResponse> {
    try {
      const response = await this.api.get<GetMachinesResponse>(
        `/Machines?token={token}&machineCode={machineCode}&details=1`
          .replace('{token}', encodeURIComponent(appConfig.LEADLOVERS_API_TOKEN || ''))
          .replace('{machineCode}', encodeURIComponent(machineCode.toString()))
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }

      return {
        Items: [],
      };
    } catch (error: any) {
      // Handle JSON parsing errors specifically
      if (error.message && error.message.includes('JSON')) {
        return {
          Items: [],
        };
      }

      if (error.response?.data?.Message) {
        process.stderr.write(`[LeadLovers API] ${error.response.data.Message}\n`);

        return {
          Items: [],
        };
      }

      process.stderr.write(`[LeadLovers API] Error fetching machine details: ${error.message}\n`);

      return {
        Items: [],
      };
    }
  }

  async getEmailSequences(params: GetEmailSequencesInput): Promise<GetSequenceEmailsResponse> {
    try {
      const response = await this.api.get<GetSequenceEmailsResponse>(
        `/EmailSequences?token={token}&machineCode={machineCode}`
          .replace('{token}', encodeURIComponent(appConfig.LEADLOVERS_API_TOKEN || ''))
          .replace('{machineCode}', encodeURIComponent(params.machineCode.toString()))
      );

      if (response.status === 200 && response.data) {
        return { Items: response.data.Items || [] };
      }

      return { Items: [] };
    } catch (error: any) {
      if (error.response?.data?.Message) {
        process.stderr.write(`[LeadLovers API] ${error.response.data.Message}\n`);
      } else {
        process.stderr.write(`[LeadLovers API] Error fetching email sequences: ${error.message}\n`);
      }

      return {
        Items: [],
      };
    }
  }
}
