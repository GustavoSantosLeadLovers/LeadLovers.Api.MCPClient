export const server = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: Number(process.env.PORT || 4444),
	VERSION: Number(process.env.VERSION || 1),
	DOMAIN_URL: process.env.DOMAIN_URL || '',
};
