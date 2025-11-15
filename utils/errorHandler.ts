/**
 * Centralized error handling utilities for Wikipedia Expo
 * Provides consistent error handling, logging, and user feedback
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private listeners: ((error: AppError) => void)[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Report an error to the error handling system
   */
  reportError(error: Error | string, context?: string, details?: any): AppError {
    const appError: AppError = {
      code: this.getErrorCode(error),
      message: typeof error === 'string' ? error : error.message,
      details: {
        context,
        ...details,
        stack: error instanceof Error ? error.stack : undefined,
      },
      timestamp: new Date(),
    };

    // Log to console in development
    if (__DEV__) {
      console.error('App Error:', appError);
    }

    // Notify listeners
    this.notifyListeners(appError);

    return appError;
  }

  /**
   * Handle API errors with specific error codes
   */
  handleApiError(error: any, operation: string): AppError {
    let errorMessage = 'Network request failed';
    let errorCode = 'NETWORK_ERROR';

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      switch (status) {
        case 404:
          errorMessage = 'Resource not found';
          errorCode = 'NOT_FOUND';
          break;
        case 429:
          errorMessage = 'Rate limit exceeded. Please try again later.';
          errorCode = 'RATE_LIMIT';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          errorCode = 'SERVER_ERROR';
          break;
        default:
          errorMessage = `Server error (${status})`;
          errorCode = 'API_ERROR';
      }
    } else if (error.request) {
      // Request made but no response received
      errorMessage = 'No response from server. Please check your connection.';
      errorCode = 'NO_RESPONSE';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
      errorCode = 'TIMEOUT';
    }

    return this.reportError(errorMessage, operation, {
      originalError: error,
      code: errorCode,
    });
  }

  /**
   * Handle network connectivity errors
   */
  handleNetworkError(operation: string): AppError {
    return this.reportError(
      'No internet connection. Please check your network settings.',
      operation,
      { code: 'NETWORK_OFFLINE' }
    );
  }

  /**
   * Handle parsing errors
   */
  handleParseError(error: Error, dataType: string): AppError {
    return this.reportError(
      `Failed to parse ${dataType}`,
      'DATA_PARSING',
      { originalError: error, dataType }
    );
  }

  /**
   * Add error listener
   */
  addListener(listener: (error: AppError) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(error: AppError): void {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        // Prevent listener errors from breaking the error handling system
        console.warn('Error in error listener:', listenerError);
      }
    });
  }

  private getErrorCode(error: Error | string): string {
    if (typeof error === 'string') {
      return 'UNKNOWN_ERROR';
    }

    // Map common error types to codes
    if (error.name === 'TypeError') return 'TYPE_ERROR';
    if (error.name === 'RangeError') return 'RANGE_ERROR';
    if (error.name === 'ReferenceError') return 'REFERENCE_ERROR';
    if (error.name === 'SyntaxError') return 'SYNTAX_ERROR';

    return 'UNKNOWN_ERROR';
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

/**
 * Error boundary utility functions
 */
export const ErrorBoundaryUtils = {
  /**
   * Get user-friendly error message for display
   */
  getUserFriendlyMessage(error: AppError): string {
    switch (error.code) {
      case 'NETWORK_OFFLINE':
        return 'No internet connection. Please check your network settings.';
      case 'NOT_FOUND':
        return 'The requested content was not found.';
      case 'RATE_LIMIT':
        return 'Too many requests. Please wait a moment and try again.';
      case 'SERVER_ERROR':
        return 'Server is temporarily unavailable. Please try again later.';
      case 'TIMEOUT':
        return 'Request timed out. Please try again.';
      default:
        return 'Something went wrong. Please try again.';
    }
  },

  /**
   * Check if error is recoverable
   */
  isRecoverable(error: AppError): boolean {
    const nonRecoverableCodes = ['NETWORK_OFFLINE', 'SERVER_ERROR'];
    return !nonRecoverableCodes.includes(error.code);
  },
};