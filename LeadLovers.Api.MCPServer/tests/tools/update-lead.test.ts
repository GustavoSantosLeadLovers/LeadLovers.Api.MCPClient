import axios from 'axios';
import { LeadLoversAPIService } from '../../src/services/leadlovers-api';
import { executeUpdateLead } from '../../src/tools/leads/update-lead';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Update Lead Tool', () => {
  let apiService: LeadLoversAPIService;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios.create to return a mocked axios instance
    mockedAxios.create = jest.fn(() => ({
      put: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    })) as any;
    
    apiService = new LeadLoversAPIService();
  });

  it('should update a lead successfully', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Message: 'Lead atualizado com sucesso!',
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.put.mockResolvedValue(mockResponse);

    const testArgs = {
      Email: 'updated@example.com',
      Name: 'Updated Lead Name',
      Phone: '+5511999999999',
      Company: 'Updated Company',
      MachineCode: 'TEST123',
      EmailSequenceCode: 2,
      SequenceLevelCode: 1,
    };

    // Act
    const result = await executeUpdateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **Lead atualizado com sucesso');
    expect(result.content[0].text).toContain('Updated Lead Name');
    expect(result.content[0].text).toContain('updated@example.com');
    expect(result.content[0].text).toContain('+5511999999999');
    expect(result.content[0].text).toContain('Updated Company');
  });

  it('should update lead with minimal data', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Message: 'Lead atualizado com sucesso!',
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.put.mockResolvedValue(mockResponse);

    const testArgs = {
      Email: 'minimal@example.com',
    };

    // Act
    const result = await executeUpdateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **Lead atualizado com sucesso');
    expect(result.content[0].text).toContain('minimal@example.com');
  });

  it('should handle API error responses', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Message: 'Erro: Lead não encontrado',
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.put.mockResolvedValue(mockResponse);

    const testArgs = {
      Email: 'nonexistent@example.com',
      Name: 'Non Existent Lead',
    };

    // Act
    const result = await executeUpdateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Erro ao atualizar lead:**');
    expect(result.content[0].text).toContain('Lead não encontrado');
  });

  it('should handle validation errors for invalid email', async () => {
    // Arrange
    const testArgs = {
      Email: 'invalid-email', // Invalid email format
      Name: 'Test Lead',
    };

    // Act
    const result = await executeUpdateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Erro ao atualizar lead:**');
  });

  it('should handle validation errors for short name', async () => {
    // Arrange
    const testArgs = {
      Email: 'test@example.com',
      Name: 'A', // Too short (minimum 2 characters)
    };

    // Act
    const result = await executeUpdateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Erro ao atualizar lead:**');
  });

  it('should handle validation errors for negative sequence codes', async () => {
    // Arrange
    const testArgs = {
      Email: 'test@example.com',
      EmailSequenceCode: -1, // Invalid negative number
    };

    // Act
    const result = await executeUpdateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Erro ao atualizar lead:**');
  });

  it('should handle network errors', async () => {
    // Arrange
    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.put.mockRejectedValue(new Error('Network error'));

    const testArgs = {
      Email: 'test@example.com',
      Name: 'Test Lead',
    };

    // Act
    const result = await executeUpdateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Erro ao atualizar lead:**');
    expect(result.content[0].text).toContain('Network error');
  });

  it('should handle update with all optional fields', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        Message: 'Lead atualizado com sucesso!',
      },
    };

    const mockAxiosInstance = (apiService as any).api;
    mockAxiosInstance.put.mockResolvedValue(mockResponse);

    const testArgs = {
      Email: 'complete@example.com',
      Name: 'Complete Lead',
      Company: 'Test Company',
      Phone: '+5511987654321',
      Photo: 'https://example.com/photo.jpg',
      City: 'São Paulo',
      State: 'SP',
      Birthday: '1990-01-01',
      Gender: 'Male',
      Score: 95,
      Tag: 5,
      Source: 'Website',
      Message: 'Test message',
      Notes: 'Test notes',
      MachineCode: 'COMPLETE123',
      EmailSequenceCode: 3,
      SequenceLevelCode: 2,
    };

    // Act
    const result = await executeUpdateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('✅ **Lead atualizado com sucesso');
    expect(result.content[0].text).toContain('Complete Lead');
    expect(result.content[0].text).toContain('Test Company');
    expect(result.content[0].text).toContain('+5511987654321');
    expect(result.content[0].text).toContain('Website');
  });

  it('should handle missing required email field', async () => {
    // Arrange
    const testArgs = {
      Name: 'Lead without Email',
      // Missing required Email field
    };

    // Act
    const result = await executeUpdateLead(testArgs, apiService);

    // Assert
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('❌ **Erro ao atualizar lead:**');
  });
});