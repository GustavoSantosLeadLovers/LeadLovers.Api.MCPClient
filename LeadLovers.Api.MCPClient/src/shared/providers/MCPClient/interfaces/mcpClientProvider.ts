export type MCPClientResult = {
	status: 'success' | 'error';
	result: unknown;
};

export interface IMCPClientProvider {
	connectToServer(serverScriptPath: string): Promise<void>;
	processQuery(query: string): Promise<MCPClientResult>;
	cleanup(): Promise<void>;
}
