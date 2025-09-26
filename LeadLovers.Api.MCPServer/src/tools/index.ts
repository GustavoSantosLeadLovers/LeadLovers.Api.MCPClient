import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

import { emailMarketingTools } from './emailMarketing'
import { emailSequencesTools } from './emailSequences';
import { leadsTools } from './leads';
import { machinesTools } from './machines';

export const registerTools = (server: McpServer) => {
  emailMarketingTools(server);
  emailSequencesTools(server);
  leadsTools(server);
  machinesTools(server);
};
