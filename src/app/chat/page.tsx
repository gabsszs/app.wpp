'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatLayout from '@/components/chat-layout';
import { conversations, users } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) {
      // Still loading, do nothing
      return;
    }
    if (error) {
      console.error('Firebase Auth Error:', error);
      // Optional: Show a toast on error
      toast({ title: 'Erro de Autenticação', description: 'Ocorreu um problema.', variant: 'destructive'});
      router.push('/auth/login');
      return;
    }
    if (!user) {
      // User is not signed in
      router.push('/auth/login');
      return;
    }
    if (!user.emailVerified) {
      // User is signed in but email is not verified
      toast({
        title: 'Verificação de E-mail Necessária',
        description: 'Por favor, verifique seu e-mail para acessar a plataforma. Um novo e-mail de verificação foi enviado caso não o encontre.',
        variant: 'destructive',
        duration: 9000
      });
      // Optionally, resend verification email here if desired
      signOut(auth); // Sign out the user
      router.push('/auth/login');
      return;
    }

  }, [user, loading, router, error, toast]);

  if (loading || !user || !user.emailVerified) {
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
