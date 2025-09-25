import { z } from 'zod';

const configSchema = z.object({
  MCP_SERVER_VERSION: z.string().default('1.0.0'),
  MCP_SERVER_NAME: z.string().default('leadlovers-mcp'),
});

export const getMCPConfig = () => {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    process.stderr.write('Failed to validate leadlovers envs:\n');
    process.stderr.write(JSON.stringify(result.error.format(), null, 2) + '\n');
    process.exit(1);
  }
  return {
    SERVER_VERSION: result.data.MCP_SERVER_VERSION,
    SERVER_NAME: result.data.MCP_SERVER_NAME,
  };
};
