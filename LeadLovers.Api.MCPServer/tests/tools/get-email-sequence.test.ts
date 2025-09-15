import axios from 'axios';
import { LeadLoversAPIService } from '../../src/services/leadlovers-api';
import { executeGetEmailSequences } from '../../src/tools/email-sequence/get-email-sequence';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Get Email Sequences Tool', () => {
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

  it('should get email sequences successfully', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Items: [
          {
            SequenceCode: 101,
            SequenceName: 'Welcome Series'
          },
          {
            SequenceCode: 102,
            SequenceName: 'Product Launch'
          },
          {
            SequenceCode: 103,
            SequenceName: 'Newsletter'
          }
        ]
      }
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 12345
    };

    // Act
    const result = await executeGetEmailSequences(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('Sua lista de sequências de e-mail na máquina 12345 inclui:');
    expect(result.content[0].text).toContain('Código da sequência: 101 - Nome da sequência: Welcome Series');
    expect(result.content[0].text).toContain('Código da sequência: 102 - Nome da sequência: Product Launch');
    expect(result.content[0].text).toContain('Código da sequência: 103 - Nome da sequência: Newsletter');
    
    // Verify API was called with correct parameters
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/EmailSequences', {
      params: { machineCode: 12345 }
    });
  });

  it('should handle empty email sequences response', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Items: []
      }
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 12345
    };

    // Act
    const result = await executeGetEmailSequences(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('Sua lista de sequências de e-mail na máquina 12345 inclui:');
    expect(result.content[0].text).toContain('.'); // Should end with period and empty list
  });

  it('should handle single email sequence', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Items: [
          {
            SequenceCode: 201,
            SequenceName: 'Onboarding Flow'
          }
        ]
      }
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 54321
    };

    // Act
    const result = await executeGetEmailSequences(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('Sua lista de sequências de e-mail na máquina 54321 inclui:');
    expect(result.content[0].text).toContain('Código da sequência: 201 - Nome da sequência: Onboarding Flow');
  });

  it('should handle API errors', async () => {
    // Arrange
    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockRejectedValue(new Error('Machine not found'));

    const testArgs = {
      machineCode: 12345
    };

    // Act & Assert
    await expect(executeGetEmailSequences(testArgs, apiService)).rejects.toThrow('Machine not found');
  });

  it('should handle validation errors for missing machineCode', async () => {
    // Arrange
    const testArgs = {}; // Missing required machineCode

    // Act & Assert
    await expect(executeGetEmailSequences(testArgs, apiService)).rejects.toThrow();
  });

  it('should handle validation errors for invalid machineCode type', async () => {
    // Arrange
    const testArgs = {
      machineCode: 'invalid' // Should be number
    };

    // Act & Assert
    await expect(executeGetEmailSequences(testArgs, apiService)).rejects.toThrow();
  });

  it('should handle validation errors for negative machineCode', async () => {
    // Arrange
    const testArgs = {
      machineCode: -1 // Invalid negative number
    };

    // Act & Assert
    await expect(executeGetEmailSequences(testArgs, apiService)).rejects.toThrow();
  });

  it('should handle zero machineCode', async () => {
    // Arrange
    const testArgs = {
      machineCode: 0
    };

    // Act & Assert
    await expect(executeGetEmailSequences(testArgs, apiService)).rejects.toThrow();
  });

  it('should handle sequences with special characters in names', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Items: [
          {
            SequenceCode: 301,
            SequenceName: 'Série de "Bem-vindos" & Tutorial'
          },
          {
            SequenceCode: 302,
            SequenceName: 'Newsletter #1 - 50% OFF!'
          }
        ]
      }
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const testArgs = {
      machineCode: 12345
    };

    // Act
    const result = await executeGetEmailSequences(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('Série de "Bem-vindos" & Tutorial');
    expect(result.content[0].text).toContain('Newsletter #1 - 50% OFF!');
  });
});