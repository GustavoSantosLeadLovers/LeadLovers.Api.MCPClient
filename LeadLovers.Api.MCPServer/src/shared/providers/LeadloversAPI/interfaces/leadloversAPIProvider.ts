export type APIResponse<R = any> = {
  isSuccess: boolean;
  data?: R;
  error?: string;
};

export interface ILeadLoversAPIProvider {
  post<T = any, R = any>(url: string, data?: T): Promise<APIResponse<R>>;
  get<T = any, R = any>(url: string, params?: T): Promise<APIResponse<R>>;
  put<T = any, R = any>(url: string, data?: T): Promise<APIResponse<R>>;
  delete<T = any, R = any>(url: string, params?: T): Promise<APIResponse<R>>;
}
