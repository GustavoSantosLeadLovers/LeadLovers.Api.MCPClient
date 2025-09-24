import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { variables } from 'shared/configs/variables';
import { APIResponse, ILeadLoversAPIProvider } from '../interfaces/leadloversAPIProvider';

type ApiResponse = {
  Message: string;
};

export class LeadLoversAPIProvider implements ILeadLoversAPIProvider {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: variables.leadlovers.API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `leadlovers-mcp/${variables.mcp.SERVER_VERSION}`,
      },
    });

    this.setupInterceptors();
  }

  public async delete<T = any, R = any>(url: string, params?: T): Promise<APIResponse<R>> {
    const response = await this.instance.get<R>(url, { params });
    process.stderr.write(
      `[MCP Server] LeadLoversAPIProvider response status: ${response.status}\n`
    );
    if (response.status >= 400) {
      return { isSuccess: false, data: undefined, error: response.statusText };
    }
    return { isSuccess: true, data: response.data || undefined, error: undefined };
  }

  public async get<T = any, R = any>(url: string, params?: T): Promise<APIResponse<R>> {
    const response = await this.instance.get<R>(url, { params });
    process.stderr.write(
      `[MCP Server] LeadLoversAPIProvider response status: ${response.status}\n`
    );
    if (response.status >= 400) {
      return { isSuccess: false, data: undefined, error: response.statusText };
    }
    return { isSuccess: true, data: response.data || undefined, error: undefined };
  }

  public async post<T = any, R = any>(url: string, data?: T): Promise<APIResponse<R>> {
    const response = await this.instance.post<R>(url, data);
    process.stderr.write(
      `[MCP Server] LeadLoversAPIProvider response status: ${response.status}\n`
    );
    if (response.status >= 400) {
      return { isSuccess: false, data: undefined, error: response.statusText };
    }
    return { isSuccess: true, data: response.data || undefined, error: undefined };
  }

  public async put<T = any, R = any>(url: string, params?: T): Promise<APIResponse<R>> {
    const response = await this.instance.get<R>(url, { params });
    process.stderr.write(
      `[MCP Server] LeadLoversAPIProvider response status: ${response.status}\n`
    );
    if (response.status >= 400) {
      return { isSuccess: false, data: undefined, error: response.statusText };
    }
    return { isSuccess: true, data: response.data || undefined, error: undefined };
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      async config => {
        try {
          if (
            variables.leadlovers.API_TOKEN &&
            variables.leadlovers.API_TOKEN !== 'your_leadlovers_api_token_here'
          ) {
            config.headers.Authorization = `Bearer ${variables.leadlovers.API_TOKEN}`;
          } else {
            process.stderr.write('[MCP Server] No API token configured - requests may fail\n');
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
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      async error => {
        if (error.response?.status === 401) {
          process.stderr.write(
            '[MCP Server] Authentication error (401) - please check your API token\n'
          );
        } else if (error.response?.status >= 500) {
          process.stderr.write(`[MCP Server] Server error: ${error.response.status}\n`);
        }

        return Promise.reject(error);
      }
    );
  }
}
