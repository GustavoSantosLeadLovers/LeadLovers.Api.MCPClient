import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  // LeadLovers API
  LEADLOVERS_API_URL: z.url().default('https://llapi.leadlovers.com/webapi'),
  LEADLOVERS_API_TOKEN: z.string().min(1, 'LeadLovers API token is required'),

  // SSO Authentication
  SSO_API_URL: z.url().default('https://globalnotifications-api.leadlovers.com'),
  SSO_TOKEN: z.string().optional(),
  SSO_REFRESH_TOKEN: z.string().optional(),
  SSO_USER_TOKEN: z.string().optional(),
  SSO_USER_ID: z.coerce.number().optional(),
  SSO_KEY: z.string().optional(),

  // Claude (Optional)
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-3-5-sonnet-20241022'),

  // MCP Server
  MCP_SERVER_NAME: z.string().default('leadlovers-mcp'),
  MCP_SERVER_VERSION: z.string().default('1.0.0'),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Security
  MAX_BULK_OPERATIONS: z.coerce.number().int().positive().default(50),
  RATE_LIMIT_REQUESTS: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000), // 15 minutes
});

export type AppConfig = z.infer<typeof configSchema>;

function validateConfig(): AppConfig {
  const result = configSchema.safeParse(process.env);

  if (!result.success) {
    process.stderr.write('Configuration validation failed:\n');
    process.stderr.write(JSON.stringify(result.error.format(), null, 2) + '\n');
    process.exit(1);
  }

  return result.data;
}

export const appConfig = validateConfig();

export const isDevelopment = appConfig.NODE_ENV === 'development';
export const isProduction = appConfig.NODE_ENV === 'production';
export const isTest = appConfig.NODE_ENV === 'test';
