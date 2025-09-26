import { IAIAPIProvider } from "shared/providers/AIAPI/interfaces/AIAPIProvider";
import { Result } from 'shared/types/defaultResult';
import { CreateEmailContentToolInput, CreateEmailContentToolOutput } from "../presentation/schemas/createEmailContent";
import { BeeFreeEmailBuilderProvider } from "shared/providers/BuiderProvider/implementations/BeeFreeEmailBuilderPrivider";

export class CreateEmailContentService {
    constructor(private readonly aiApi: IAIAPIProvider, private readonly beeFreeApi: BeeFreeEmailBuilderProvider) {}

    public async execute(
        input: CreateEmailContentToolInput
    ): Promise<Result<CreateEmailContentToolOutput>> {
        try {
          const aiContent = await this.aiApi.create(input.prompt);
          const simpleSchema = this.beeFreeApi.aiContentToSimpleSchema(aiContent);
          const fullJson = await this.beeFreeApi.simpleToFullJson(simpleSchema);
          
          return {
            isSuccess: true,
            message: 'Email content created successfully',
            data: { fullJson },
          };
        } catch (error: any) {
          let message = 'Failed to create email content';
          if (error.response?.data?.Message) message = error.response.data.Message;
          if (error.message) message = error.message;
          process.stderr.write(`[MCP Server] Error creating email content: ${message}\n`);
          return {
            isSuccess: false,
            message,
            data: { fullJson: message },
          };
        }
      }
}