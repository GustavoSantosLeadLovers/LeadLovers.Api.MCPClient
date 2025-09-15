// Jest setup file
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set up test environment defaults
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Reduce log noise during tests

// Mock console methods to reduce noise during tests
const originalConsole = console;

// Only mock if not in debug mode
if (!process.env.DEBUG_TESTS) {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    // Keep error for debugging - allow console.error from API service
    error: (message, ...args) => {
      if (typeof message === 'string' && message.includes('[LeadLovers API]')) {
        originalConsole.error(message, ...args);
      }
      // Still call the original for other errors
      originalConsole.error(message, ...args);
    },
  };
}

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
});

// Global error handling
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection during tests:', reason);
});

// Add custom Jest matchers if needed
expect.extend({
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid date`
          : `expected ${received} to be a valid date`,
      pass,
    };
  },
});

// Declare custom matchers for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidDate(): R;
    }
  }
}