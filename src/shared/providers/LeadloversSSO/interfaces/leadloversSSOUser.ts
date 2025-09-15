import { ILeadLoversSSOSession } from './leadloversSSOSession';

export interface ILeadLoversSSOUser {
	id: number;
	username: string;
	email: string;
	name: string;
	user_id: number;
	session: ILeadLoversSSOSession;
}
