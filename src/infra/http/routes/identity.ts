import { Router } from 'express';

import { CreateSessionPayloadService } from '@modules/identity/application/createSessionPayloadService';
import { ValidateSSOTokenService } from '@modules/identity/application/validateSSOTokenService';
import { LeadloversSSO } from '@modules/identity/external/sso/leadloversSSO';
import { CreateSessionHandler } from '@modules/identity/presentation/handlers/createSessionHandler';
import { LeadLoversSSOProvider } from '@shared/providers/LeadloversSSO/implementations/leadloversSSOProvider';

const createSessionHandler = new CreateSessionHandler(
	new ValidateSSOTokenService(new LeadloversSSO(new LeadLoversSSOProvider())),
	new CreateSessionPayloadService(),
);

export const session = (router: Router): void => {
	router.post(
		'/sessions',
		createSessionHandler.handle.bind(createSessionHandler),
	);
};
