import { getLeadLoversConfig } from './leadlovers';
import { getMCPConfig } from './mcp';
import { getAnthropicConfig } from './anthropic';
import { getBeeFreeConfig } from './beefree';

export const variables = {
  leadlovers: getLeadLoversConfig(),
  anthropic: getAnthropicConfig(),
  beefree: getBeeFreeConfig(),
  mcp: getMCPConfig(),
};
