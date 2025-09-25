import axios from 'axios';
import { CreateBeeFreeSessionOutput } from '../presentation/dtos/createBeeFreeSessionDTO';

type Params = {
	clientId: string;
	clientSecret: string;
	userId?: string;
};

export class AuthenticateBeeFreeService {
	public async execute({
		clientId,
		clientSecret,
		userId,
	}: Params): Promise<CreateBeeFreeSessionOutput> {
		const response = await axios.post(
			'https://auth.getbee.io/loginV2',
			{
				client_id: clientId,
				client_secret: clientSecret,
				uid: userId || 'demo-user',
			},
			{ headers: { 'Content-Type': 'application/json' } },
		);
		return { token: response.data };
	}
}
