import axios, { AxiosInstance } from 'axios';

import { variables } from '@shared/configs/variables';
import { ILeadLoversSSOProvider } from '../interfaces/leadloversSSOProvider';
import { ILeadLoversSSOSession } from '../interfaces/leadloversSSOSession';
import { ILeadLoversSSOUser } from '../interfaces/leadloversSSOUser';

export class LeadLoversSSOProvider implements ILeadLoversSSOProvider {
	private service: AxiosInstance;

	constructor() {
		this.service = axios.create({
			baseURL: variables.auth.SSO_URL,
			validateStatus: status => status < 500,
		});
	}

	public async getUser({
		token,
		refresh_token,
	}: ILeadLoversSSOSession): Promise<ILeadLoversSSOUser | undefined> {
		try {
			const response = await this.service.get<ILeadLoversSSOUser>(
				'users',
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (response.status === 401) {
				const newSession = await this.refreshToken(refresh_token);
				if (newSession) return this.getUser(newSession);
				return undefined;
			}
			const user = {
				...response.data,
				user_id: +response.data.user_id,
				session: {
					token,
					refresh_token,
				},
			} as ILeadLoversSSOUser;
			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Internal server error');
		}
	}

	public async refreshToken(
		refresh_token: string,
	): Promise<ILeadLoversSSOSession | undefined> {
		const response = await this.service.put<ILeadLoversSSOSession>(
			'sessions',
			{
				refresh_token,
			},
		);
		if (response.status !== 200) return undefined;
		return response.data;
	}

	public async validateToken({
		token,
		refresh_token,
	}: ILeadLoversSSOSession): Promise<ILeadLoversSSOUser | undefined> {
		try {
			const response = await this.service.get('sessions', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.status === 204) {
				const user = await this.getUser({ token, refresh_token });
				if (!user) return undefined;
				user.session = {
					token,
					refresh_token,
				};
				return user;
			}
			const refreshedSession = await this.refreshToken(refresh_token);
			if (!refreshedSession) return undefined;
			const user = await this.getUser(refreshedSession);
			if (!user) return undefined;
			user.session = refreshedSession;
			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Internal server error');
		}
	}
}
