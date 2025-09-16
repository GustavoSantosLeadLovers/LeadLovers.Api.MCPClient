export const redis = {
	URL: process.env.REDIS_URL || 'redis://localhost:6379',
	PASSWORD: process.env.REDIS_PASSWORD,
	TTL: {
		USER_CONNECTION: 3600, // 1 hour TTL for user connections
	},
};
