'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export default function SignOutButton() {
  return (
    <Button
      onClick={() =>
        signOut({
          redirect: true,
          redirectTo: '/',
        })
      }
      variant="ghost"
      className="w-full text-muted hover:text-rose"
    >
      Sign Out
    </Button>
  );
}
