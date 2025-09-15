<!-- 1. Analise as modificações feitas.

2. Crie uma branch nova

3. Verifique se tem algum erro de digitação

4. Verifique se tem algum nome que foge dos padrões (use o código já existente e as documentações ja criadas presentes da pasta docs)

5. Verifique se tem algum erro de lógica

6. Atualize a documentação

7. Faça os commits

8. Faça push

9. Crie a PR -->



Caminhos:

Caminho base:
Client -> Cria sessão usando endpoint HTTP -> API MCP Client
Client -> Cria conexão com websocket -> API MCP Client
Client -> Enviar prompt ätravés do evento websocket (send-prompt)

A - Apenas 1 prompt
1. API MCP Client -> Envia prompt do cliente para a Anthropic LLM
2. Anthropic LLM -> indica qual tool do MCP Server usar -> API MCP Client
3. API MCP Client -> Envia evento via websocket informando status da solicitação: "iniciada" -> Client
4. API MCP Client -> "Chama" tool indicada pelo LLM -> MCP Server
5. MCP Server -> Executa tool e retorna resposta -> API MCP Client
6. API MCP Client -> Envia evento via websocket informando status da solicitação: "concluida" ou "erro" -> Client

B - Chat com LLM até chegar na versão final do prompt
1. API MCP Client -> Envia prompt do cliente para a Anthropic LLM
2. Anthropic LLM -> Indica se é necessários mais informações ou qual tool do MCP Server usar -> API MCP Client
** Se for necessário mais informações **
    2.1. API MCP Client -> Envia evento via websocket informando a resposta da LLM -> Client
    2.2. Client -> Envia mais informações através do evento websocket (send-prompt) -> API MCP Client
    Voltar para o passo 1
** Se for para usar uma tool **
3. API MCP Client -> Envia evento via websocket informando status da solicitação: "iniciada" -> Client
4. API MCP Client -> "Chama" tool indicada pelo LLM -> MCP Server
5. MCP Server -> Executa tool e retorna resposta -> API MCP Client
6. API MCP Client -> Envia evento via websocket informando status da solicitação: "concluida" ou "erro" -> Client