import { NextResponse } from 'next/server';
import { ApiResponse, ApiError } from '@/types';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
  }
}

export function apiResponse<T>(
  data: T,
  statusCode = 200,
  message = 'Success'
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  );
}

export function apiError(
  error: unknown,
  defaultStatusCode = 500,
  defaultMessage = 'An error occurred'
): NextResponse<ApiResponse<null>> {
  let statusCode = defaultStatusCode;
  let message = defaultMessage;
  let code: string | undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    code = 'VALIDATION_ERROR';
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.error('[API Error]', { statusCode, message, code, error });

  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: statusCode }
  );
}

export function validateRequired(value: unknown, fieldName: string): asserts value {
  if (!value) {
    throw new AppError(`${fieldName} is required`, 400, 'MISSING_FIELD');
  }
}

export function validateEmail(email: string): asserts email {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
  }
}

export function validateId(id: unknown): asserts id is string {
  if (typeof id !== 'string' || id.length !== 24) {
    throw new AppError('Invalid ID format', 400, 'INVALID_ID');
  }
}
