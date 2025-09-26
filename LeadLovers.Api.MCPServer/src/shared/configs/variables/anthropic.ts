import { z } from 'zod';

const configSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, 'Anthropic API key is required'),
  ANTHROPIC_MODEL: z.string().default('claude-3-5-haiku-20241022'),
});

export const getAnthropicConfig = () => {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    process.stderr.write('Failed to validate anthropic envs:\n');
    process.stderr.write(JSON.stringify(result.error.format(), null, 2) + '\n');
    process.exit(1);
  }
  return {
    API_KEY: result.data.ANTHROPIC_API_KEY,
    API_MODEL: result.data.ANTHROPIC_MODEL,
  };
};
