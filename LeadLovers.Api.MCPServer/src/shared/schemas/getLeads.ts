import { z } from 'zod';

export const getLeadsInputShape = {
  page: z.number().min(1).describe('Número da página para paginação, começando em 1'),
  startDate: z.string().optional().describe('Data de início do cadastro do lead (AAAA-MM-DD)'),
  endDate: z.string().optional().describe('Data de término do cadastro do lead (AAAA-MM-DD)'),
};

export const getLeadsOutputShape = {
  Data: z
    .array(
      z.object({
        Email: z.string().describe('Email do lead'),
        Name: z.string().describe('Nome do lead'),
        Company: z.string().describe('Empresa do lead'),
        Phone: z.string().describe('Telefone do lead'),
        Photo: z.string().describe('URL da foto do lead'),
        City: z.string().describe('Cidade do lead'),
        State: z.string().describe('Estado do lead'),
        Birthday: z.string().describe('Data de nascimento do lead'),
        Gender: z.string().describe('Gênero do lead'),
        Score: z.number().describe('Pontuação do lead'),
        RegistrationDate: z.string().describe('Data de cadastro do lead'),
      })
    )
    .describe('Lista de leads'),
  Links: z
    .object({
      Self: z.string().describe('Link para a página atual'),
      Next: z.string().describe('Link para a próxima página'),
      Prev: z.string().describe('Link para a página anterior'),
    })
    .describe('Links de navegação entre páginas'),
};

export const getLeadsToolInput = z.object(getLeadsInputShape);
export const getLeadsToolOutput = z.object(getLeadsOutputShape);
