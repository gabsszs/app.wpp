'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatLayout from '@/components/chat-layout';
import { conversations, users } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-20 w-full" />
           <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  // This is a placeholder. In a real app, you would fetch user data from your database
  // based on the authenticated user's UID.
  const loggedInUser: User = {
    id: user.uid,
    name: user.displayName || 'Usuário',
    email: user.email || '',
    avatarUrl: user.photoURL || `https://placehold.co/100x100.png`,
    role: 'agent', // You might want to manage roles in your database
    status: 'online',
    company: 'ConectaZap',
  };


  return <ChatLayout conversations={conversations} loggedInUser={loggedInUser} />;
}
