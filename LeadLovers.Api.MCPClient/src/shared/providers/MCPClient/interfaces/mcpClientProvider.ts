export interface IMCPClientProvider {
	connectToServer(serverScriptPath: string): Promise<void>;
	processQuery(query: string): Promise<string[]>;
	cleanup(): Promise<void>;
}
