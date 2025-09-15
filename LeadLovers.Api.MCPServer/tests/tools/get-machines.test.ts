import axios from 'axios';
import { LeadLoversAPIService } from '../../src/services/leadlovers-api';
import { executeGetMachines } from '../../src/tools/machines/get-machines';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Get Machines Tool', () => {
  let apiService: LeadLoversAPIService;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios.create to return a mocked axios instance
    mockedAxios.create = jest.fn(() => ({
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    })) as any;
    
    apiService = new LeadLoversAPIService();
  });

  it('should get machines successfully with default parameters', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Items: [
          {
            MachineCode: 12345,
            MachineName: 'Test Machine 1',
            MachineImage: 'https://example.com/image1.jpg',
            Views: 100,
            Leads: 50
          },
          {
            MachineCode: 12346,
            MachineName: 'Test Machine 2',
            MachineImage: 'https://example.com/image2.jpg',
            Views: 200,
            Leads: 75
          }
        ],
        CurrentPage: 1,
        Registers: 2
      }
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {};

    // Act
    const result = await executeGetMachines(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('Foram encontradas 2 máquinas');
    expect(result.content[0].text).toContain('Test Machine 1');
    expect(result.content[0].text).toContain('Test Machine 2');
    expect(result.content[0].text).toContain('Código: 12345');
    expect(result.content[0].text).toContain('Leads: 50');
  });

  it('should get machines successfully with custom parameters', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Items: [
          {
            MachineCode: 12345,
            MachineName: 'Filtered Machine',
            MachineImage: 'https://example.com/image1.jpg',
            Views: 300,
            Leads: 150
          }
        ],
        CurrentPage: 2,
        Registers: 1
      }
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {
      page: 2,
      registers: 5,
      details: 1,
      types: 'funnel'
    };

    // Act
    const result = await executeGetMachines(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('Foram encontradas 1 máquinas');
    expect(result.content[0].text).toContain('Filtered Machine');
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/Funnels', {
      params: {
        page: 2,
        registers: 5,
        details: 1,
        types: 'funnel'
      }
    });
  });

  it('should handle empty machines response', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Items: [],
        CurrentPage: 1,
        Registers: 0
      }
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {};

    // Act
    const result = await executeGetMachines(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('Foram encontradas 0 máquinas');
  });

  it('should handle null response data', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: null
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {};

    // Act
    const result = await executeGetMachines(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ Não foi possível obter a lista de máquinas');
  });

  it('should handle missing Items property', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        CurrentPage: 1,
        Registers: 0
      }
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {};

    // Act
    const result = await executeGetMachines(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ Não foi possível obter a lista de máquinas');
  });

  it('should handle API errors', async () => {
    // Arrange
    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

    const testArgs = {};

    // Act & Assert
    await expect(executeGetMachines(testArgs, apiService)).rejects.toThrow('Network error');
  });

  it('should handle validation errors for invalid parameters', async () => {
    // Arrange
    const testArgs = {
      page: -1, // Invalid page number
      registers: 'invalid' // Invalid type
    };

    // Act & Assert
    await expect(executeGetMachines(testArgs, apiService)).rejects.toThrow();
  });
});