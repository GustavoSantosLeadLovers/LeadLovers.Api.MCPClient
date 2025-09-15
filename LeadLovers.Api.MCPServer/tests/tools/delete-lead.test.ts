import axios from 'axios';
import { LeadLoversAPIService } from '../../src/services/leadlovers-api';
import { executeDeleteLead } from '../../src/tools/leads/delete-lead';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Delete Lead Tool', () => {
  let apiService: LeadLoversAPIService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock axios.create to return a mocked axios instance
    mockedAxios.create = jest.fn(() => ({
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    })) as any;

    apiService = new LeadLoversAPIService();
  });

  it('should delete a lead successfully with email', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Message: 'Lead deletado com sucesso!',
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 42,
      sequenceCode: 10,
      email: 'delete@example.com',
    };

    // Act
    const result = await executeDeleteLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **Lead deletado com sucesso**');
    expect(result.content[0].text).toContain('**Máquina:** 42');
    expect(result.content[0].text).toContain('**Email:** delete@example.com');
    expect(result.content[0].text).toContain('O lead foi removido do funil e sequência de emails.');
  });

  it('should delete a lead successfully with phone', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Message: 'Lead deletado com sucesso!',
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 42,
      sequenceCode: 10,
      phone: '+5511999999999',
    };

    // Act
    const result = await executeDeleteLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **Lead deletado com sucesso**');
    expect(result.content[0].text).toContain('**Telefone:** +5511999999999');
  });

  it('should handle null response data', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: null,
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 42,
      sequenceCode: 10,
      email: 'test@example.com',
    };

    // Act
    const result = await executeDeleteLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Não foi possível deletar o lead**');
    expect(result.content[0].text).toContain('**Causa:** Erro desconhecido ao deletar lead');
  });

  it('should handle response without Message property', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Status: 'OK', // Missing Message property
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 42,
      sequenceCode: 10,
      email: 'test@example.com',
    };

    // Act
    const result = await executeDeleteLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Não foi possível deletar o lead**');
    expect(result.content[0].text).toContain('**Causa:** Erro desconhecido ao deletar lead');
  });

  it('should handle validation errors for missing machineCode', async () => {
    // Arrange
    const testArgs = {
      sequenceCode: 10,
      email: 'test@example.com',
      // Missing required machineCode
    };

    // Act
    const result = await executeDeleteLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Dados inválidos fornecidos**');
    expect(result.content[0].text).toContain('- **machineCode**:');
    expect(result.content[0].text).toContain('**Sugestão:** Verifique os dados e tente novamente.');
  });

  it('should handle validation errors for missing sequenceCode', async () => {
    // Arrange
    const testArgs = {
      machineCode: 12345,
      email: 'test@example.com',
      // Missing required sequenceCode
    };

    // Act
    const result = await executeDeleteLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Dados inválidos fornecidos**');
    expect(result.content[0].text).toContain('- **sequenceCode**:');
    expect(result.content[0].text).toContain('**Sugestão:** Verifique os dados e tente novamente.');
  });

  it('should handle validation errors for invalid machineCode type', async () => {
    // Arrange
    const testArgs = {
      machineCode: 'invalid', // Should be number
      sequenceCode: 10,
      email: 'test@example.com',
    };

    // Act
    const result = await executeDeleteLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Dados inválidos fornecidos**');
    expect(result.content[0].text).toContain('- **machineCode**:');
    expect(result.content[0].text).toContain('**Sugestão:** Verifique os dados e tente novamente.');
  });

  it('should handle API error with error message', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Message: 'Erro: Lead não encontrado',
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 42,
      sequenceCode: 10,
      email: 'notfound@example.com',
    };

    // Act
    const result = await executeDeleteLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Não foi possível deletar o lead**');
    expect(result.content[0].text).toContain('**Causa:** Erro ao deletar lead: Erro: Lead não encontrado');
  });

  it('should handle deletion with only required fields', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Message: 'Lead deletado com sucesso!',
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 54,
      sequenceCode: 20,
    };

    // Act
    const result = await executeDeleteLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **Lead deletado com sucesso**');
    expect(result.content[0].text).toContain('**Email:** não informado');
    expect(result.content[0].text).toContain('**Telefone:** não informado');
  });
});