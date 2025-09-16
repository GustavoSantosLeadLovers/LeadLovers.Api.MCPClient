import logger from '@infra/logger/pinoLogger';
import ISSOProvider, {
	Session,
	ValidateTokenParams,
} from '@modules/identity/external/sso/interfaces/ssoProvider';
import { ILeadLoversSSOProvider } from '@shared/providers/LeadloversSSO/interfaces/leadloversSSOProvider';

export class LeadloversSSO implements ISSOProvider {
	constructor(private ssoProvider: ILeadLoversSSOProvider) {}

	public async validateToken(params: ValidateTokenParams): Promise<Session> {
		const user = await this.ssoProvider.validateToken({
			token: params.token,
			refresh_token: params.refreshToken,
		});
		if (!user) {
			logger.error('Leadlovers SSO: Authentication failed');
			throw new Error('Authentication failed');
		}
		return {
			id: user.user_id.toString(),
			email: user.email,
			name: user.name,
		};
	}
}
