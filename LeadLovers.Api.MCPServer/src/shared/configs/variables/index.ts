import { getLeadLoversConfig } from './leadlovers';
import { getMCPConfig } from './mcp';

export const variables = {
  leadlovers: getLeadLoversConfig(),
  mcp: getMCPConfig(),
};
