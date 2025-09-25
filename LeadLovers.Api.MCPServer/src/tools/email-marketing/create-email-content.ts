import { AIService } from 'services/ai-api';
import { MCPToolResult, McpToolSchema } from '../../types/mcp';
import { MessageFormatter } from '../../utils/message-formatter';
import { ZodError } from 'zod';
import { CreateEmailContentInput, createEmailContentSchema } from 'schemas/emailMarketing';
import { BeeFreeAPIService } from 'services/beefree-api';

export const createEmailContentTool: McpToolSchema = {
  name: 'create_email_content',
  description: 'Cria o conteúdo de um e-mail marketing baseado nas informações fornecidas.',
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'Informações sobre o conteúdo do e-mail que deseja criar (obrigatório)',
        minLength: 50
      }
    },
    required: ['prompt'],
  },
  outputSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', description: 'Indica se a operação foi bem-sucedida' },
      action: { type: 'string', description: 'Ação realizada' },
      details: {
        type: 'object',
        description: 'Objeto final compatível com o Builder BeeFree',
      },
    },
  },
};

export async function executecreateEmailContent(
  args: unknown,
  aiService: AIService,
  beeFreeService: BeeFreeAPIService
): Promise<MCPToolResult> {
  let validatedData: CreateEmailContentInput;
  
  try {
    validatedData = createEmailContentSchema.parse(args);
  } catch (error) {
    if (error instanceof ZodError) {
      return MessageFormatter.formatValidationError(error);
    }
    return MessageFormatter.formatError({
      action: 'criar o conteúdo do e-mail marketing',
      cause: 'Dados inválidos fornecidos',
    });
  }

  const aiContent = await aiService.generateEmailContent(validatedData.prompt);
  const simpleSchema = beeFreeService.convertToSimpleSchema(aiContent);
  const fullJson = await beeFreeService.convertSimpleToFull(simpleSchema);

  return MessageFormatter.formatSuccess({
    action: `Conteúdo de e-mail criado com sucesso!`,
    details: {
      fullJson: JSON.stringify(fullJson)
    }
  });
}