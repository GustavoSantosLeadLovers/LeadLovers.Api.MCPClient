export interface IEmailBuilderProvider {
    aiContentToSimpleSchema(aiContent: any): any;
    simpleToFullJson(simpleSchema: any): Promise<any>;
}