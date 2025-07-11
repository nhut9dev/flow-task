import { AppError } from '~lib/errors/AppError';

describe('AppError', () => {
  it('should create AppError with default values', () => {
    const error = new AppError('Test error');

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.isOperational).toBe(true);
  });

  it('should create AppError with custom values', () => {
    const error = new AppError('Custom error', 404, 'NOT_FOUND', false);

    expect(error.message).toBe('Custom error');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.isOperational).toBe(false);
  });

  it('should use static methods correctly', () => {
    const badRequest = AppError.badRequest('Bad request');
    expect(badRequest.statusCode).toBe(400);
    expect(badRequest.code).toBe('BAD_REQUEST');

    const notFound = AppError.notFound('Not found');
    expect(notFound.statusCode).toBe(404);
    expect(notFound.code).toBe('NOT_FOUND');

    const internal = AppError.internal('Internal error');
    expect(internal.statusCode).toBe(500);
    expect(internal.code).toBe('INTERNAL_ERROR');
  });

  it('should be instanceof Error', () => {
    const error = new AppError('Test error');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });
});
