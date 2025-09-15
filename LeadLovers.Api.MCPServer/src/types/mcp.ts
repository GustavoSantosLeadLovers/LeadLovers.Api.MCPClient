export interface MCPToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

export interface McpToolSchema {
  name: string;
  description: string;
  inputSchema: object;
  outputSchema?: object;
}
