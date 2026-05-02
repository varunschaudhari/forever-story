'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password. Please try again.',
    default: 'An authentication error occurred. Please try again.',
  };

  const message = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8 md:p-12">
          <Link href="/" className="text-3xl font-serif font-bold text-primary block mb-8 text-center">
            ForeverStory
          </Link>

          <p className="text-4xl text-center mb-6">⚠️</p>

          <h1 className="heading-4 text-center mb-6">Oops!</h1>

          <div className="mb-8 p-4 bg-secondary/10 border border-rose text-rose rounded-lg text-sm">
            {message}
          </div>

          <p className="text-center text-on-surface-variant mb-8">
            Something went wrong with your sign in. Please try again or create a new account.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <Link href="/auth/signin" className="w-full">
              <Button variant="gold" className="w-full">
                Try Signing In Again
              </Button>
            </Link>
            <Link href="/auth/signup" className="w-full">
              <Button variant="outline" className="w-full">
                Create New Account
              </Button>
            </Link>
          </div>

          <Link href="/" className="block text-center text-primary hover:underline font-medium transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
