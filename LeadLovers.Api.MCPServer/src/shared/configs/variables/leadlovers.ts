import { z } from 'zod';

const configSchema = z.object({
  LEADLOVERS_API_URL: z.string().url().default('https://llapi.leadlovers.com/webapi'),
  LEADLOVERS_API_TOKEN: z.string().min(1, 'LeadLovers API token is required'),
});

export const getLeadLoversConfig = () => {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    process.stderr.write('Failed to validate leadlovers envs:\n');
    process.stderr.write(JSON.stringify(result.error.format(), null, 2) + '\n');
    process.exit(1);
  }
  return {
    API_URL: result.data.LEADLOVERS_API_URL,
    API_TOKEN: result.data.LEADLOVERS_API_TOKEN,
  };
};
