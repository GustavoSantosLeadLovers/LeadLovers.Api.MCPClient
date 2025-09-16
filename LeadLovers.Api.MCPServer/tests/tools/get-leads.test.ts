import axios from 'axios';
import { LeadLoversAPIService } from '../../src/services/leadlovers-api';
import { executeGetLeads } from '../../src/tools/leads/get-leads';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Get Leads Tool', () => {
  let apiService: LeadLoversAPIService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock axios.create to return a mocked axios instance
    mockedAxios.create = jest.fn(() => ({
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    })) as any;

    apiService = new LeadLoversAPIService();
  });

  it('should get leads successfully', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Data: [
          {
            Name: 'John Doe',
            Email: 'john@example.com',
            Company: 'Test Company',
            Phone: '+5511999999999',
            City: 'São Paulo',
            State: 'SP',
            RegistrationDate: '2024-01-15',
          },
          {
            Name: 'Jane Smith',
            Email: 'jane@example.com',
            Company: 'Another Company',
            Phone: '+5511888888888',
            City: 'Rio de Janeiro',
            State: 'RJ',
            RegistrationDate: '2024-01-16',
          },
        ],
        Links: {
          Self: 'current-page-link',
          Next: 'next-page-link',
          Prev: null,
        },
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {
      page: 1,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    };

    // Act
    const result = await executeGetLeads(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **2 leads encontrados**');
    expect(result.content[0].text).toContain('**Página:** 1');
    expect(result.content[0].text).toContain('**John Doe**');
    expect(result.content[0].text).toContain('📧 john@example.com');
    expect(result.content[0].text).toContain('🏢 Test Company');
    expect(result.content[0].text).toContain('📞 +5511999999999');
    expect(result.content[0].text).toContain('**Lista de Leads:**');
  });

  it('should handle empty results', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Data: [],
        Links: {
          Self: 'current-page-link',
          Next: null,
          Prev: null,
        },
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {
      page: 1,
    };

    // Act
    const result = await executeGetLeads(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **Busca realizada com sucesso**');
    expect(result.content[0].text).toContain('**Resultado:** 0 leads encontrados');
    expect(result.content[0].text).toContain('💡 **Dica:** Tente ajustar o período de busca');
  });

  it('should handle null response as empty results', async () => {
    // Arrange
    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue({ status: 200, data: null });

    const testArgs = {
      page: 1,
    };

    // Act
    const result = await executeGetLeads(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **Busca realizada com sucesso**');
    expect(result.content[0].text).toContain('**Resultado:** 0 leads encontrados');
    expect(result.content[0].text).toContain('💡 **Dica:** Tente ajustar o período de busca');
  });

  it('should handle validation errors', async () => {
    // Arrange
    const testArgs = {
      page: -1, // Invalid page number
      startDate: 'invalid-date',
    };

    // Act
    const result = await executeGetLeads(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Dados inválidos fornecidos**');
    expect(result.content[0].text).toContain('- **page**:');
    expect(result.content[0].text).toContain('**Sugestão:** Verifique os dados e tente novamente.');
  });

  it('should handle missing required page parameter', async () => {
    // Arrange
    const testArgs = {
      startDate: '2024-01-01',
      // Missing required page
    };

    // Act
    const result = await executeGetLeads(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Dados inválidos fornecidos**');
    expect(result.content[0].text).toContain('- **page**:');
    expect(result.content[0].text).toContain('**Sugestão:** Verifique os dados e tente novamente.');
  });

  it('should handle leads with minimal data', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Data: [
          {
            Name: 'Minimal Lead',
            Email: 'minimal@example.com',
            // Missing other optional fields
          },
        ],
        Links: {
          Self: 'current-page-link',
          Next: null,
          Prev: null,
        },
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {
      page: 1,
    };

    // Act
    const result = await executeGetLeads(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **1 leads encontrados**');
    expect(result.content[0].text).toContain('**Minimal Lead**');
    expect(result.content[0].text).toContain('📧 minimal@example.com');
  });
});