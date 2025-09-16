import { ILeadLoversSSOSession } from './leadloversSSOSession';
import { ILeadLoversSSOUser } from './leadloversSSOUser';

export interface ILeadLoversSSOProvider {
	getUser(
		session: ILeadLoversSSOSession,
	): Promise<ILeadLoversSSOUser | undefined>;
	refreshToken(
		refresh_token: string,
	): Promise<ILeadLoversSSOSession | undefined>;
	validateToken(
		session: ILeadLoversSSOSession,
	): Promise<ILeadLoversSSOUser | undefined>;
}
