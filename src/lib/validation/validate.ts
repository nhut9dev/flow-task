import { z } from 'zod';

import { AppError } from '~lib/errors/AppError';

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => err.message).join(', ');
      throw AppError.validation(messages, 'VALIDATION_ERROR');
    }
    throw error;
  }
}

export function validateInputSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => err.message).join(', ');
      return { success: false, error: messages };
    }
    return { success: false, error: 'Validation failed' };
  }
}

export function validatePartial<T>(schema: z.ZodSchema<T>, data: unknown): Partial<T> {
  try {
    return (schema as any).partial().parse(data) as Partial<T>;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => err.message).join(', ');
      throw AppError.validation(messages, 'VALIDATION_ERROR');
    }
    throw error;
  }
}
