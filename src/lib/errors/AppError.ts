export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code?: string): AppError {
    return new AppError(message, 400, code || 'BAD_REQUEST');
  }

  static unauthorized(message: string = 'Unauthorized', code?: string): AppError {
    return new AppError(message, 401, code || 'UNAUTHORIZED');
  }

  static forbidden(message: string = 'Forbidden', code?: string): AppError {
    return new AppError(message, 403, code || 'FORBIDDEN');
  }

  static notFound(message: string = 'Not found', code?: string): AppError {
    return new AppError(message, 404, code || 'NOT_FOUND');
  }

  static conflict(message: string, code?: string): AppError {
    return new AppError(message, 409, code || 'CONFLICT');
  }

  static validation(message: string, code?: string): AppError {
    return new AppError(message, 422, code || 'VALIDATION_ERROR');
  }

  static internal(message: string = 'Internal server error', code?: string): AppError {
    return new AppError(message, 500, code || 'INTERNAL_ERROR');
  }
}
