import axios from 'axios';
import { LeadLoversAPIService } from '../../src/services/leadlovers-api';
import { executeCreateLead } from '../../src/tools/leads/create-lead';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Create Lead Tool', () => {
  let apiService: LeadLoversAPIService;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios.create to return a mocked axios instance
    mockedAxios.create = jest.fn(() => ({
      post: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    })) as any;
    
    apiService = new LeadLoversAPIService();
  });

  it('should create a lead successfully', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Message: 'ID123456', // API retorna ID do lead criado
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const testArgs = {
      Name: 'Test Lead',
      Email: 'test@example.com',
      MachineCode: 42,
      EmailSequenceCode: 1,
      SequenceLevelCode: 1,
    };

    // Act
    const result = await executeCreateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **Lead criado com sucesso');
    expect(result.content[0].text).toContain('**ID:** ID123456');
    expect(result.content[0].text).toContain('**Nome:** Test Lead');
    expect(result.content[0].text).toContain('**Email:** test@example.com');
    expect(result.content[0].text).toContain('💡 **Dica:**');
  });

  it('should handle API error responses', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Message: 'Erro: Email já existe no sistema',
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const testArgs = {
      Name: 'Test Lead',
      Email: 'existing@example.com',
      MachineCode: 42,
      EmailSequenceCode: 1,
      SequenceLevelCode: 1,
    };

    // Act
    const result = await executeCreateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Não foi possível criar o lead**');
    expect(result.content[0].text).toContain('**Causa:** Email já existe na base de dados');
    expect(result.content[0].text).toContain('**Sugestão:** Use um email diferente ou atualize o lead existente');
  });

  it('should handle validation errors', async () => {
    // Arrange
    const testArgs = {
      Name: 'A', // Too short
      Email: 'invalid-email',
    };

    // Act
    const result = await executeCreateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Dados inválidos fornecidos**');
    expect(result.content[0].text).toContain('- **Name**:');
    expect(result.content[0].text).toContain('- **Email**:');
    expect(result.content[0].text).toContain('**Sugestão:** Verifique os dados e tente novamente.');
  });

  it('should handle missing response from API', async () => {
    // Arrange
    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.post.mockResolvedValue({ status: 200, data: null });

    const testArgs = {
      Name: 'Test Lead',
      Email: 'test@example.com',
      MachineCode: 42,
      EmailSequenceCode: 1,
      SequenceLevelCode: 1,
    };

    // Act
    const result = await executeCreateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Não foi possível criar o lead**');
    expect(result.content[0].text).toContain('**Causa:** Erro desconhecido ao criar lead');
    expect(result.content[0].text).toContain('**Sugestão:** Verifique os dados fornecidos e tente novamente');
  });
});
