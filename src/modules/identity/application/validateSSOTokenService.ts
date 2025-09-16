import ISSOProvider from '@modules/identity/external/sso/interfaces/ssoProvider';

type SSOPayload = {
	id: string;
	email: string;
	name: string;
};

type Params = {
	token: string;
	refreshToken: string;
};

export class ValidateSSOTokenService {
	constructor(private readonly sessionProvider: ISSOProvider) {}

	public async execute({ token, refreshToken }: Params): Promise<SSOPayload> {
		try {
			const user = await this.sessionProvider.validateToken({
				token,
				refreshToken,
			});
			return { id: user.id, email: user.email, name: user.name };
		} catch (error: unknown) {
			throw new Error(
				error instanceof Error ? error.message : 'SSO validation error',
			);
		}
	}
}
