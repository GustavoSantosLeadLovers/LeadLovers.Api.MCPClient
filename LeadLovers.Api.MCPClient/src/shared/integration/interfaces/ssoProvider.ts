export type ValidateTokenParams = {
	token: string;
	refreshToken: string;
};

export type Session = {
	id: string;
	email: string;
	name: string;
};

export default interface ISSOProvider {
	validateToken(params: ValidateTokenParams): Promise<Session>;
}
