export function validateAndFormatResponse(response: any) {
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