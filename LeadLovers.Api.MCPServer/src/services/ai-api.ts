import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';

export class AIService {
  private anthropic: Anthropic | null;
  private openai: OpenAI | null;
  private defaultProvider: string;
  private maxTokens: number;

  constructor() {
    this.openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

    this.anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
    
    this.defaultProvider = process.env.DEFAULT_AI_PROVIDER || '';
    this.maxTokens = parseInt(process.env.DEFAULT_AI_MAX_TOKENS || '1000');
  }

  async generateEmailContent(prompt: string, provider = null) {
    const selectedProvider = provider || this.defaultProvider;
    
    try {
      if (selectedProvider === 'openai' && this.openai) {
        return await this.generateWithOpenAI(prompt);
      } else if (selectedProvider === 'anthropic' && this.anthropic) {
        return await this.generateWithAnthropic(prompt);
      } else {
        console.log('No AI API keys configured, using mock response');
        return prompt;
      }
    } catch (error) {
      console.error(`Error with ${selectedProvider}:`, error);
      return prompt;
    }
  }

  async generateWithAnthropic(prompt: string) {
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.getUserPrompt(prompt);

    if (!this.anthropic) throw new Error('Anthropic API key not configured');

    const message = await this.anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
      max_tokens: this.maxTokens,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt }
      ]
    });

    const response = JSON.parse(message.content.find(content => content.type == 'text')?.text || '{}');

    return this.validateAndFormatResponse(response);
  }

  async generateWithOpenAI(prompt: string) {
    if (!this.openai) throw new Error('OpenAI API key not configured');

    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.getUserPrompt(prompt);

    const completion = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: this.maxTokens,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');

    return this.validateAndFormatResponse(response);
  }

  getSystemPrompt() {
    return `Você é um especialista em email marketing. Sua tarefa é gerar conteúdo profissional para emails baseado nos prompts dos usuários.

      Sempre responda em formato JSON válido com esta estrutura:
      {
        "title": "Título chamativo e profissional para o email",
        "body": "Conteúdo principal do email, bem estruturado e persuasivo. Use quebras de linha (\\n\\n) para separar parágrafos.",
        "cta": "Texto do call-to-action (máximo 4 palavras)",
        "footer": "Texto do rodapé (assinatura, disclaimer, etc.)"
      }

      Diretrizes:
      - Use linguagem profissional mas acessível
      - Seja persuasivo sem ser agressivo
      - Mantenha o foco no objetivo do email
      - Use quebras de linha para melhor legibilidade
      - Adapte o tom ao contexto (promocional, informativo, etc.)
      - CTAs devem ser claros e diretos
      - Inclua elementos de urgência quando apropriado`;
  }

  getUserPrompt(prompt: string) {
    return `Crie um email profissional baseado neste prompt:

    "${prompt}"

    Lembre-se de retornar apenas o JSON válido com title, body, cta e footer.`;
  }

  validateAndFormatResponse(response: any) {
    if (!response.title || !response.body || !response.cta) {
      throw new Error('Invalid AI response format');
    }

    return {
      title: response.title.trim(),
      body: response.body.trim(),
      cta: response.cta.trim(),
      footer: response.footer ? response.footer.trim() : 'Enviado com 💙 pela nossa equipe'
    };
  }
}
