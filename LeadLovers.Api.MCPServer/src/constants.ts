import { readFileSync } from 'fs';
import { join } from 'path';

// Lê o package.json para obter nome e versão dinamicamente, útil pra User-Agent
const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

export const USER_AGENT = `${packageJson.name}/${packageJson.version}`;
export const API_VERSION = '1.0';
export const CLIENT_INFO = {
  name: packageJson.name,
  version: packageJson.version,
  userAgent: USER_AGENT,
};
