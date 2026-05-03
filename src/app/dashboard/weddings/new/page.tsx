import Link from 'next/link';
import { auth } from '@/auth';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Create Wedding - ForeverStory',
};

export default async function CreateWeddingPage() {
  const session = await auth();

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-serif text-on-surface mb-4">Create a New Wedding</h1>
      <p className="text-lg text-on-surface-variant mb-12">
        Start building your digital heirloom and share your love story with the world
      </p>

      <div className="card-base p-12 text-center">
        <p className="text-5xl mb-6">✨</p>
        <h2 className="text-3xl font-serif text-on-surface mb-4">Wedding Builder Coming Soon</h2>
        <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
          We're building the most beautiful and intuitive wedding builder for you. It will let you:
        </p>

        <ul className="text-left max-w-md mx-auto mb-12 space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">✓</span>
            <span className="text-on-surface">Create a stunning wedding website</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">✓</span>
            <span className="text-on-surface">Upload unlimited photos and videos</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">✓</span>
            <span className="text-on-surface">Manage guest RSVPs and invitations</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">✓</span>
            <span className="text-on-surface">Share your story with custom themes</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">✓</span>
            <span className="text-on-surface">Preserve your memories forever</span>
          </li>
        </ul>

        <Link href="/dashboard">
          <Button variant="outline" size="lg">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
