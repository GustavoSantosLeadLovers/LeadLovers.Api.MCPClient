export function getUserPrompt(prompt: string): string {
    return `Crie um email profissional baseado neste prompt:

    "${prompt}"

    Lembre-se de retornar apenas o JSON válido com title, body, cta e footer.`;
}