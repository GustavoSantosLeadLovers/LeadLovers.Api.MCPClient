export interface SSOTokens {
  token: string;
  refreshToken: string;
  userToken: string;
  userId?: number;
  key?: string;
}

export interface SSOUser {
  id?: number;
  token: string;
  email: string;
  name: string;
  session?: SSOSession;
}

export interface SSOSession {
  token: string;
  refreshToken: string;
  expiresAt?: Date;
  isValid?: boolean;
}

export type TokenValidationResponse =
  | {
      status: 'success';
      result: SSOUser;
    }
  | {
      status: 'error';
      error: string;
    };

export interface AuthHeaders {
  Authorization: string;
  'X-User-Token'?: string;
  'Content-Type': string;
  'User-Agent': string;
}

export interface AuthConfig {
  user_token: string;
  tokenCacheTimeout: number;
  maxRetries: number;
}

export interface CachedToken {
  value: string;
  expiresAt: Date;
  isExpired: () => boolean;
}

export type AuthenticationStrategy = 'sso_token';

export interface AuthenticationResult {
  success: boolean;
  headers: AuthHeaders;
  strategy: AuthenticationStrategy;
  error?: string;
}
