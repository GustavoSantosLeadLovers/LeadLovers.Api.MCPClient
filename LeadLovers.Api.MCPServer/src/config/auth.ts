import type { AuthConfig } from '../auth/types';
import { appConfig } from '../server/config';

export function createAuthConfig(): AuthConfig {
  return {
    user_token: appConfig.LEADLOVERS_API_TOKEN,
    tokenCacheTimeout: 30 * 60 * 1000, // 30 minutes
    maxRetries: 3,
  };
}

export const authConfig = createAuthConfig();
