import Anthropic from '@anthropic-ai/sdk';
import { cleanJsonResponse } from 'utils/cleanJsonResponse';
import { getSystemPrompt } from 'utils/getSystemPrompt';
import { getUserPrompt } from 'utils/getUserPrompt';
import { validateAndFormatResponse } from 'utils/validateAIContentResponse';
import { IAIAPIProvider } from '../interfaces/AIAPIProvider';

export class AnthropicAPIProvider implements IAIAPIProvider {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async create(prompt: string): Promise<any> {
    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt(prompt);

    const message = await this.anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
      max_tokens: 8192,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const messageCleaned = cleanJsonResponse(
      message.content.find(content => content.type == 'text')?.text || '{}'
    );

    const response = JSON.parse(JSON.stringify(messageCleaned));

    const validatedResponse = validateAndFormatResponse(response);

    return validatedResponse;
  }
}
