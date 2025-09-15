import { Request, Response } from 'express';

import { CreateSessionPayloadService } from '@modules/identity/application/createSessionPayloadService';
import { ValidateSSOTokenService } from '@modules/identity/application/validateSSOTokenService';
import {
	createSessionInput,
	createSessionOutput,
} from '../dtos/createSessionDTO';

export class CreateSessionHandler {
	constructor(
		private readonly validateSSOTokenService: ValidateSSOTokenService,
		private readonly createSessionPayloadService: CreateSessionPayloadService,
	) {}
	public async handle(
		request: Request,
		response: Response,
	): Promise<Response> {
		try {
			const input = createSessionInput.safeParse(request.body);
			if (!input.success) {
				return response
					.status(400)
					.json({ status: 'error', result: input.error });
			}
			const ssoPayload = await this.validateSSOTokenService.execute(
				input.data,
			);
			const sessionPayload =
				await this.createSessionPayloadService.execute(ssoPayload);
			const output = createSessionOutput.safeParse(sessionPayload);
			if (!output.success) {
				return response
					.status(400)
					.json({ status: 'error', result: output.error });
			}
			return response
				.status(201)
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
