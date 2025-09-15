import { Router } from 'express';

import { session } from './identity';
import { monitor } from './monitor';

const router = Router({ mergeParams: true });

export const routes = () => {
	monitor(router);
	session(router);
	return router;
};
