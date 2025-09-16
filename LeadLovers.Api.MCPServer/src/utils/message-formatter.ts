import { MCPToolResult } from 'types/mcp';
import { ZodError } from 'zod';

export interface SuccessMessageConfig {
  action: string;
  details?: Record<string, any>;
  contextInfo?: string[];
}

export interface ErrorMessageConfig {
  action: string;
  cause?: string;
  suggestion?: string;
}

export class MessageFormatter {
  static formatSuccess(config: SuccessMessageConfig): MCPToolResult {
    const { action, details, contextInfo } = config;

    let message = `✅ **${action}**\n\n`;

    if (details) {
      Object.entries(details).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          message += `**${key}:** ${value}\n`;
        }
      });
    }

    if (contextInfo && contextInfo.length > 0) {
      message += '\n' + contextInfo.join('\n');
    }

    return {
      content: [{ type: 'text', text: message.trim() }],
      isError: false,
    };
  }

  static formatError(config: ErrorMessageConfig): MCPToolResult {
    const { action, cause, suggestion } = config;

    let message = `❌ **Não foi possível ${action.toLowerCase()}**`;

    if (cause) {
      message += `\n\n**Causa:** ${cause}`;
    }

    if (suggestion) {
      message += `\n**Sugestão:** ${suggestion}`;
    }

    return {
      content: [{ type: 'text', text: message }],
      isError: true,
    };
  }

  static formatValidationError(error: ZodError): MCPToolResult {
    const issues = error.issues
      .map(issue => {
        const field = issue.path.join('.');
        return `- **${field}**: ${issue.message}`;
      })
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `❌ **Dados inválidos fornecidos**\n\n${issues}\n\n**Sugestão:** Verifique os dados e tente novamente.`,
        },
      ],
      isError: true,
    };
  }

  static formatApiError(message: string, action: string): MCPToolResult {
    // Categoriza diferentes tipos de erros da API LeadLovers
    if (message.toLowerCase().includes('token') || message.toLowerCase().includes('unauthorized')) {
      return this.formatError({
        action,
        cause: 'Token de autenticação inválido ou expirado',
        suggestion: 'Verifique se o token da API está configurado corretamente no arquivo .env',
      });
    }

    if (message.toLowerCase().includes('email') && message.toLowerCase().includes('existe')) {
      return this.formatError({
        action,
        cause: 'Email já existe na base de dados',
        suggestion: 'Use um email diferente ou atualize o lead existente',
      });
    }

    if (message.toLowerCase().includes('máquina') || message.toLowerCase().includes('machine')) {
      return this.formatError({
        action,
        cause: 'Código da máquina inválido',
        suggestion: 'Verifique se o código da máquina existe em sua conta LeadLovers',
      });
    }

    if (message.toLowerCase().includes('sequência') || message.toLowerCase().includes('sequence')) {
      return this.formatError({
        action,
        cause: 'Código da sequência de email inválido',
        suggestion: 'Verifique se a sequência existe na máquina especificada',
      });
    }

    // Erro genérico da API
    return this.formatError({
      action,
      cause: message,
      suggestion: 'Verifique os dados fornecidos e tente novamente',
    });
  }

  static isApiError(response: any): boolean {
    if (!response || !response.Message) return false;

    const message = response.Message.toLowerCase();
    return (
      message.includes('erro') ||
      message.includes('error') ||
      message.includes('falha') ||
      message.includes('inválido') ||
      message.includes('invalid')
    );
  }
}

// Helper functions para casos específicos mais comuns
export const formatLeadSuccess = (action: string, leadData: any) => {
  return MessageFormatter.formatSuccess({
    action: `Lead ${action} com sucesso`,
    details: {
      Nome: leadData.Name,
      Email: leadData.Email,
      Telefone: leadData.Phone,
      Empresa: leadData.Company,
      Máquina: leadData.MachineCode,
    },
  });
};

export const formatMachineSuccess = (machines: any[], totalCount: number) => {
  const machinesList = machines
    .map(
      machine =>
        `- **${machine.MachineName}** (Código: ${machine.MachineCode}, Leads: ${machine.Leads || 0}, Views: ${machine.Views || 0})`
    )
    .join('\n');

  return MessageFormatter.formatSuccess({
    action: `${totalCount} máquinas encontradas`,
    contextInfo: [
      'Máquinas disponíveis:',
      machinesList,
      '\n💡 **Dica:** Use o código da máquina para criar leads nela.',
    ],
  });
};
