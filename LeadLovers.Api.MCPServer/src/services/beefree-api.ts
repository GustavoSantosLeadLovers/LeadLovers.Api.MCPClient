export class BeeFreeAPIService {
    private baseUrl: string;
    private token: string;

    constructor() {
        this.baseUrl = process.env.BEEFREE_API_URL || 'https://api.getbee.io/v1/';
        this.token = process.env.BEEFREE_API_TOKEN || '';
    }

    async convertSimpleToFull(simpleSchema: any): Promise<any> {
        if (!this.token) throw new Error('BeeFree API token is not configured.');
        
        const response = await fetch(`${this.baseUrl}conversion/simple-to-full-json`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(simpleSchema)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`BeeFree API error (${response.status}):`, errorText);
        }

        const fullJsonResponse = await response.json();
        
        return fullJsonResponse;
    }

    convertToSimpleSchema(aiResponse: any): any {
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
                            text: aiResponse.title,
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
                            text: aiResponse.body.replace(/\n\n/g, '<br><br>'),
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
                            text: aiResponse.cta,
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
                            text: aiResponse.footer,
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
}