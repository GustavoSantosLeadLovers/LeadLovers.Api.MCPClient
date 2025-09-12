import { Router } from 'express';

import { monitor } from './monitor';

const router = Router({ mergeParams: true });

export const routes = () => {
	monitor(router);
	return router;
};
