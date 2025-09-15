import axios from 'axios';
import { LeadLoversAPIService } from '../../src/services/leadlovers-api';
import { executeGetMachineDetails } from '../../src/tools/machines/get-machine-details';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock console to capture stdout.write
const mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

describe('Get Machine Details Tool', () => {
  let apiService: LeadLoversAPIService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStdoutWrite.mockClear();
    
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

  afterAll(() => {
    mockStdoutWrite.mockRestore();
  });

  it('should get machine details successfully', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Items: [
          {
            MachineCode: 12345,
            MachineName: 'Detailed Machine',
            MachineImage: 'https://example.com/detailed.jpg',
            Views: 500,
            Leads: 200
          }
        ],
        CurrentPage: 1,
        Registers: 1
      }
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 12345
    };

    // Act
    const result = await executeGetMachineDetails(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('Os detalhes da máquina com código 12345');
    expect(result.content[0].text).toContain('Nome: Detailed Machine');
    expect(result.content[0].text).toContain('Código: 12345');
    expect(result.content[0].text).toContain('Visualizações: 500');
    expect(result.content[0].text).toContain('Leads: 200');
    
    // Verify that machine details were logged to stdout
    expect(mockStdoutWrite).toHaveBeenCalledWith(
      expect.stringContaining('"MachineCode": 12345')
    );
    
    // Verify API was called with correct parameters
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/Funnels', {
      params: { machineCode: 12345 }
    });
  });

  it('should handle machine not found', async () => {
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

    const testArgs = {
      machineCode: 99999
    };

    // Act
    const result = await executeGetMachineDetails(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('Os detalhes da máquina com código 99999');
    expect(result.content[0].text).toContain('Nenhuma máquina encontrada com esse código');
  });

  it('should handle null response data', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: null
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 12345
    };

    // Act
    const result = await executeGetMachineDetails(testArgs, apiService);

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

    const testArgs = {
      machineCode: 12345
    };

    // Act
    const result = await executeGetMachineDetails(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ Não foi possível obter a lista de máquinas');
  });

  it('should handle API errors', async () => {
    // Arrange
    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockRejectedValue(new Error('Machine not found'));

    const testArgs = {
      machineCode: 12345
    };

    // Act & Assert
    await expect(executeGetMachineDetails(testArgs, apiService)).rejects.toThrow('Machine not found');
  });

  it('should handle validation errors for missing machineCode', async () => {
    // Arrange
    const testArgs = {}; // Missing required machineCode

    // Act & Assert
    await expect(executeGetMachineDetails(testArgs, apiService)).rejects.toThrow();
  });

  it('should handle validation errors for invalid machineCode type', async () => {
    // Arrange
    const testArgs = {
      machineCode: 'invalid' // Should be number
    };

    // Act & Assert
    await expect(executeGetMachineDetails(testArgs, apiService)).rejects.toThrow();
  });

  it('should handle validation errors for negative machineCode', async () => {
    // Arrange
    const testArgs = {
      machineCode: -1 // Invalid negative number
    };

    // Act & Assert
    await expect(executeGetMachineDetails(testArgs, apiService)).rejects.toThrow();
  });
});