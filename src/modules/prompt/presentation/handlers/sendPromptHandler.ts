import { sendPromptInput, SendPromptOutput } from '../dtos/sendPromptDTO';

export class SendPromptHandler {
	public async handle(prompt: string): Promise<SendPromptOutput> {
		const input = sendPromptInput.safeParse({ prompt });
		if (!input.success) {
			return { status: 'error', result: input.error };
		}
		return { status: 'success', result: 'Prompt received successfully' };
	}
}
