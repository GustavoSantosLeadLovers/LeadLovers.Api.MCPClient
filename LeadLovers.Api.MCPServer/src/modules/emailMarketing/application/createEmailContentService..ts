import { IAIAPIProvider } from "shared/providers/AIAPI/interfaces/AIAPIProvider";
import { CreateEmailContentToolInput, CreateEmailContentToolOutput } from "../presentation/schemas/createEmailContent";
import { BeeFreeEmailBuilderProvider } from "shared/providers/BuiderProvider/implementations/BeeFreeEmailBuilderPrivider";

export class CreateEmailContentService {
    constructor(private readonly aiApi: IAIAPIProvider, private readonly beeFreeApi: BeeFreeEmailBuilderProvider) {}

    public async execute(input: CreateEmailContentToolInput): Promise<CreateEmailContentToolOutput> {
        try {
          const aiContent = await this.aiApi.create(input.prompt);
          const simpleSchema = this.beeFreeApi.aiContentToSimpleSchema(aiContent);
          const fullJson = await this.beeFreeApi.simpleToFullJson(simpleSchema);
          
          return { fullJson };
        } catch (error: any) {
          if (error.response?.data?.Message) {
            process.stderr.write(`[MCP Server] ${error.response.data.Message}\n`);
          } else {
            process.stderr.write(`[MCP Server] Error creating email content: ${error.message}\n`);
          }
          return { fullJson: error.message };
        }
      }
}