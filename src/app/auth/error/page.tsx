'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password.',
    default: 'An authentication error occurred.',
  };

  const message = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Link href="/" className="text-2xl font-bold text-blue-600 block mb-8 text-center">
            ForeverStory
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Authentication Error</h1>

          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
            {message}
          </div>

          <p className="text-center text-gray-600 mb-6">
            Please try signing in again or create a new account.
          </p>

          <div className="flex gap-4">
            <Link href="/auth/signin" className="flex-1 btn btn-primary text-center">
              Sign In
            </Link>
            <Link href="/auth/signup" className="flex-1 btn btn-secondary text-center">
              Sign Up
            </Link>
          </div>

          <Link href="/" className="block mt-6 text-center text-blue-600 hover:text-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
