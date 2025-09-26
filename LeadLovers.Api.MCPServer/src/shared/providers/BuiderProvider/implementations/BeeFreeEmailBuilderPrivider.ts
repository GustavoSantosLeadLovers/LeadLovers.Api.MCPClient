import axios, { AxiosInstance } from "axios";
import { IEmailBuilderProvider } from "../interfaces/emailBuilderProvider";
import { variables } from "shared/configs/variables";

export class BeeFreeEmailBuilderProvider implements IEmailBuilderProvider {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: variables.beefree.API_URL,
            timeout: 30000,
            headers: {
                'Authorization': `Bearer ${variables.beefree.API_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': `leadlovers-mcp/${variables.mcp.SERVER_VERSION}`,
            },
        });
    }

    aiContentToSimpleSchema(aiContent: any): any {
        return {
            template: {
                type: "email",
                rows: [
                {
                    name: "header_row",
                    columns: [
                    {
                        weight: 12,
                        modules: [
                        {
                            type: "title",
                            text: aiContent.title,
                            title: "h1",
                            size: 24,
                            bold: true,
                            align: "center",
                            color: "#1A5276",
                            "padding-top": 30,
                            "padding-bottom": 20
                        }
                        ]
                    }
                    ]
                },
                {
                    name: "content_row",
                    columns: [
                    {
                        weight: 12,
                        modules: [
                        {
                            type: "paragraph",
                            text: aiContent.body.replace(/\n\n/g, '<br><br>'),
                            size: 16,
                            "line-height": 1.6,
                            color: "#333333",
                            "padding-top": 10,
                            "padding-bottom": 25,
                            "padding-left": 20,
                            "padding-right": 20
                        }
                        ]
                    }
                    ]
                },
                {
                    name: "cta_row",
                    columns: [
                    {
                        weight: 12,
                        modules: [
                        {
                            type: "button",
                            text: aiContent.cta,
                            href: "https://example.com",
                            "background-color": "#007BFF",
                            color: "#FFFFFF",
                            "border-radius": 8,
                            "padding-top": 18,
                            "padding-bottom": 18,
                            "padding-left": 40,
                            "padding-right": 40,
                            align: "center"
                        }
                        ]
                    }
                    ]
                },
                {
                    name: "footer_row",
                    columns: [
                    {
                        weight: 12,
                        modules: [
                        {
                            type: "paragraph",
                            text: aiContent.footer,
                            size: 12,
                            color: "#666666",
                            align: "center",
                            "padding-top": 40,
                            "padding-bottom": 20
                        }
                        ]
                    }
                    ]
                }
                ]
            }
        };
    }

    async simpleToFullJson(simpleSchema: any): Promise<string> {
        const response = await this.instance.post('conversion/simple-to-full-json', simpleSchema);
        
        const fullJsonResponse = await response.data;
        
        return JSON.stringify(fullJsonResponse, null, 2);
    }
}