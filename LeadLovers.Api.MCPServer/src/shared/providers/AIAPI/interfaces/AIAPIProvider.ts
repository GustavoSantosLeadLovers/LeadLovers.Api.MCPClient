export interface IAIAPIProvider {
  create(prompt: string): Promise<any>;
}