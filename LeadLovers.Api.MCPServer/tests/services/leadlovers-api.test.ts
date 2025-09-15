import axios from 'axios';
import { LeadLoversAPIService } from '../../src/services/leadlovers-api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock process.stderr.write
const mockStderrWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);

describe('LeadLoversAPIService', () => {
  let apiService: LeadLoversAPIService;
  let mockAxiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStderrWrite.mockClear();
    
    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    };

    // Mock axios.create to return our mocked instance
    mockedAxios.create = jest.fn(() => mockAxiosInstance);
    
    apiService = new LeadLoversAPIService();
  });

  afterAll(() => {
    mockStderrWrite.mockRestore();
  });

  describe('constructor', () => {
    it('should create axios instance with correct configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: expect.any(String),
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': expect.stringContaining('leadlovers-mcp/')
        }
      });
    });

    it('should setup interceptors', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('createLead', () => {
    it('should create lead successfully', async () => {
      // Arrange
      const mockResponse = {
        status: 200,
        data: {
          Message: 'Lead criado com sucesso! ID: 12345'
        }
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const leadData = {
        Name: 'Test Lead',
        Email: 'test@example.com',
        MachineCode: 'TEST123',
        EmailSequenceCode: 1,
        SequenceLevelCode: 1
      };

      // Act
      const result = await apiService.createLead(leadData);

      // Assert
      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v1/Leads', leadData);
    });

    it('should handle API errors when creating lead', async () => {
      // Arrange
      const errorResponse = {
        response: {
          status: 400,
          data: { Message: 'Email já existe' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      const leadData = {
        Name: 'Test Lead',
        Email: 'existing@example.com',
        MachineCode: 'TEST123',
        EmailSequenceCode: 1,
        SequenceLevelCode: 1
      };

      // Act & Assert
      await expect(apiService.createLead(leadData)).rejects.toEqual(errorResponse);
    });
  });

  describe('getMachines', () => {
    it('should get machines with default parameters', async () => {
      // Arrange
      const mockResponse = {
        status: 200,
        data: {
          Items: [
            { MachineCode: 1, MachineName: 'Test Machine', Views: 100, Leads: 50 }
          ],
          CurrentPage: 1,
          Registers: 1
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const params = {};

      // Act
      const result = await apiService.getMachines(params);

      // Assert
      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/Funnels', { params: {} });
    });

    it('should get machines with custom parameters', async () => {
      // Arrange
      const mockResponse = {
        status: 200,
        data: {
          Items: [],
          CurrentPage: 2,
          Registers: 0
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const params = {
        page: 2,
        registers: 5,
        details: 1,
        types: 'funnel'
      };

      // Act
      const result = await apiService.getMachines(params);

      // Assert
      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/Funnels', { params });
    });
  });

  describe('getMachineDetails', () => {
    it('should get machine details successfully', async () => {
      // Arrange
      const mockResponse = {
        status: 200,
        data: {
          Items: [
            { MachineCode: 12345, MachineName: 'Detailed Machine', Views: 200, Leads: 100 }
          ],
          CurrentPage: 1,
          Registers: 1
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const machineCode = 12345;

      // Act
      const result = await apiService.getMachineDetails(machineCode);

      // Assert
      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/Funnels', {
        params: { machineCode }
      });
    });
  });

  describe('getEmailSequences', () => {
    it('should get email sequences successfully', async () => {
      // Arrange
      const mockResponse = {
        status: 200,
        data: {
          Items: [
            { SequenceCode: 101, SequenceName: 'Welcome Series' },
            { SequenceCode: 102, SequenceName: 'Newsletter' }
          ]
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const params = { machineCode: 12345 };

      // Act
      const result = await apiService.getEmailSequences(params);

      // Assert
      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/EmailSequences', { params });
    });
  });

  describe('interceptors', () => {
    it('should handle missing API token', async () => {
      // This test verifies that the service handles cases where no API token is configured
      // The actual interceptor logic is tested indirectly through other methods
      
      // Arrange
      const mockResponse = { status: 200, data: { Message: 'Success' } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const leadData = {
        Name: 'Test',
        Email: 'test@example.com',
        MachineCode: 'TEST',
        EmailSequenceCode: 1,
        SequenceLevelCode: 1
      };

      // Act
      await apiService.createLead(leadData);

      // Assert
      expect(mockAxiosInstance.post).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      // Arrange
      const networkError = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(networkError);

      // Act & Assert
      await expect(apiService.getMachines({})).rejects.toThrow('Network Error');
    });

    it('should handle timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('timeout of 30000ms exceeded');
      mockAxiosInstance.get.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(apiService.getMachines({})).rejects.toThrow('timeout of 30000ms exceeded');
    });

    it('should handle HTTP error responses', async () => {
      // Arrange
      const httpError = {
        response: {
          status: 500,
          data: { error: 'Internal Server Error' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(httpError);

      const leadData = {
        Name: 'Test',
        Email: 'test@example.com',
        MachineCode: 'TEST',
        EmailSequenceCode: 1,
        SequenceLevelCode: 1
      };

      // Act & Assert
      await expect(apiService.createLead(leadData)).rejects.toEqual(httpError);
    });
  });
});