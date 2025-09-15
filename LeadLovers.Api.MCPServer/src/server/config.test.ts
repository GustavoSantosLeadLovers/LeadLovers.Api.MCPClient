import { z } from 'zod';

// Simplified config for tests - no ESM imports that conflict with Jest
const configSchema = z.object({
  // LeadLovers API
  LEADLOVERS_API_URL: z.string().url().default('https://llapi.leadlovers.com/webapi'),
  LEADLOVERS_API_TOKEN: z.string().default('test-token'),

  // SSO Authentication
  SSO_API_URL: z.string().url().default('https://globalnotifications-api.leadlovers.com'),
  SSO_TOKEN: z.string().default('test-sso-token'),
  SSO_REFRESH_TOKEN: z.string().default('test-refresh-token'),
  SSO_USER_TOKEN: z.string().default('test-user-token'),
  SSO_USER_ID: z.coerce.number().optional(),
  SSO_KEY: z.string().optional(),

  // Claude (Optional)
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-3-5-sonnet-20241022'),

  // MCP Server
  MCP_SERVER_NAME: z.string().default('leadlovers-mcp-test'),
  MCP_SERVER_VERSION: z.string().default('1.0.0-test'),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('test'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('error'),

  // Security
  MAX_BULK_OPERATIONS: z.coerce.number().int().positive().default(50),
  RATE_LIMIT_REQUESTS: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
});

export type AppConfig = z.infer<typeof configSchema>;

function validateConfig(): AppConfig {
  const result = configSchema.safeParse(process.env);
  
  if (!result.success) {
    // For tests, just use defaults
    return configSchema.parse({});
  }
  
  return result.data;
}

export const appConfig = validateConfig();
export const isDevelopment = appConfig.NODE_ENV === 'development';
export const isProduction = appConfig.NODE_ENV === 'production';
export const isTest = appConfig.NODE_ENV === 'test';