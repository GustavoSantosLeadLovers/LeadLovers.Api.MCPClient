import { Router } from 'express';

import { CreateSessionPayloadService } from '@modules/identity/application/createSessionPayloadService';
import { ValidateSSOTokenService } from '@modules/identity/application/validateSSOTokenService';
import { LeadloversSSO } from '@modules/identity/external/sso/implementations/leadloversSSO';
import { CreateSessionHandler } from '@modules/identity/presentation/handlers/createSessionHandler';
import { LeadLoversSSOProvider } from '@shared/providers/LeadloversSSO/implementations/leadloversSSOProvider';

const createSessionHandler = new CreateSessionHandler(
	new ValidateSSOTokenService(new LeadloversSSO(new LeadLoversSSOProvider())),
	new CreateSessionPayloadService(),
);

/**
 * @swagger
 * /sessions:
 *   post:
 *     tags:
 *       - Identity
 *     summary: Criar nova sessão de usuário
 *     description: |
 *       Cria uma nova sessão de usuário validando tokens SSO e gerando JWT interno.
 *
 *       **Fluxo de autenticação:**
 *       1. Valida os tokens SSO fornecidos
 *       2. Busca dados do usuário no sistema SSO
 *       3. Gera um JWT interno para a sessão
 *       4. Retorna o JWT e dados básicos do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionRequest'
 *           example:
 *             token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvYW8gU2lsdmEiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *             refreshToken: "refresh_abc123def456"
 *     responses:
 *       201:
 *         description: Sessão criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       example: "success"
 *                     result:
 *                       $ref: '#/components/schemas/CreateSessionResponse'
 *             example:
 *               status: "success"
 *               result:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvYW8gU2lsdmEiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *                 name: "João Silva"
 *                 email: "joao.silva@exemplo.com"
 *       400:
 *         description: Dados de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       example: "error"
 *                     result:
 *                       type: object
 *                       description: Detalhes dos erros de validação Zod
 *             example:
 *               status: "error"
 *               result:
 *                 code: "invalid_type"
 *                 message: "Required"
 *                 path: ["token"]
 *       401:
 *         description: Token SSO inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       example: "error"
 *                     result:
 *                       type: string
 *                       example: "Authentication failed"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       example: "error"
 *                     result:
 *                       type: string
 *                       example: "Internal server error"
 *     security: []
 */
export const session = (router: Router): void => {
	router.post(
		'/sessions',
		createSessionHandler.handle.bind(createSessionHandler),
	);
};
