export type MCPClientResult<ResultType = unknown> = {
	status: 'success' | 'error';
	result: string | ResultType;
};

export interface IMCPClientProvider {
	connectToServer(serverScriptPath: string): Promise<void>;
	processQuery<Result>(query: string): Promise<MCPClientResult<Result>>;
	cleanup(): Promise<void>;
}
