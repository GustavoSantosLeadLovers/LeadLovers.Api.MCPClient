import { AuthenticateBeeFreeService } from '@modules/identity/application/authenticateBeeFreeService';
import { Request, Response } from 'express';
import {
	createBeeFreeSessionInput,
	createBeeFreeSessionOutput,
} from '../dtos/createBeeFreeSessionDTO';

export class CreateBeeFreeSessionHandler {
	constructor(
		private readonly authenticateBeeFreeService: AuthenticateBeeFreeService,
	) {}
	public async handle(
		request: Request,
		response: Response,
	): Promise<Response> {
		try {
			const input = createBeeFreeSessionInput.safeParse(request.body);
			if (!input.success) {
				return response
					.status(400)
					.json({ status: 'error', result: input.error });
			}
			const token = await this.authenticateBeeFreeService.execute(
				input.data,
			);
			const output = createBeeFreeSessionOutput.safeParse(token);
			if (!output.success) {
				return response
					.status(400)
					.json({ status: 'error', result: input.error });
			}
			return response
				.status(200)
				.json({ status: 'success', result: output.data });
		} catch (error: unknown) {
			return response.status(500).json({
				status: 'error',
				result:
					error instanceof Error
						? error.message
						: 'Internal server error',
			});
		}
	}
}
