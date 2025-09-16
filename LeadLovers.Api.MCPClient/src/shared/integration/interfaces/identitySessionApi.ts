export type JWTPayload = {
	id: string;
	email: string;
	name: string;
};

export interface IdentitySessionApi {
	validateJWTToken(token: string): JWTPayload;
}
