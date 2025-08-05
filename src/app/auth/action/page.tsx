'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { MailCheck, KeyRound, AlertCircle } from 'lucide-react';

function AuthActionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [mode, setMode] = useState<string | null>(null);
  const [actionCode, setActionCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resetting' | 'form'>('loading');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const codeParam = searchParams.get('oobCode');
    setMode(modeParam);
    setActionCode(codeParam);

    if (!modeParam || !codeParam) {
      setStatus('error');
      setMessage('Parâmetros inválidos. Por favor, tente novamente a partir do link no seu e-mail.');
      return;
    }

    handleAction(modeParam, codeParam);
  }, [searchParams]);

  const handleAction = async (mode: string, actionCode: string) => {
    try {
      switch (mode) {
        case 'verifyEmail':
          await applyActionCode(auth, actionCode);
          setStatus('success');
          setMessage('Seu e-mail foi verificado com sucesso! Agora você pode fazer login.');
          toast({ title: 'Sucesso', description: 'E-mail verificado!' });
          break;
        case 'resetPassword':
          await verifyPasswordResetCode(auth, actionCode);
          setStatus('form');
          setMessage('Por favor, insira sua nova senha.');
          break;
        default:
          setStatus('error');
          setMessage('Ação desconhecida. Por favor, verifique o link e tente novamente.');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`Ocorreu um erro: ${error.message}. O link pode ter expirado.`);
      toast({ title: 'Erro', description: 'O link de ação é inválido ou já foi utilizado.', variant: 'destructive' });
    }
  };
  
  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    if (!actionCode) return;

    setStatus('resetting');
    try {
      await confirmPasswordReset(auth, actionCode, password);
      setStatus('success');
      setMessage('Sua senha foi redefinida com sucesso! Você já pode fazer login com a nova senha.');
      toast({ title: "Senha Redefinida", description: "Sua senha foi alterada com sucesso." });
    } catch (error: any) {
       setStatus('error');
       setMessage(`Ocorreu um erro ao redefinir a senha: ${error.message}`);
       toast({ title: "Erro", description: "Não foi possível redefinir a senha.", variant: "destructive" });
    }
  }


  if (status === 'loading') {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (status === 'error') {
     return (
       <Card>
        <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="mt-4">Link Inválido ou Expirado</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <p className="mb-6 text-muted-foreground">{message}</p>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
                Voltar para o Login
            </Button>
        </CardContent>
       </Card>
     )
  }
  
  if (status === 'success') {
     return (
       <Card>
        <CardHeader className="text-center">
             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MailCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mt-4">Sucesso!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <p className="mb-6 text-muted-foreground">{message}</p>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
                Ir para o Login
            </Button>
        </CardContent>
       </Card>
     )
  }
  
  if (status === 'form') {
    return (
       <Card>
        <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mt-4">Redefina sua Senha</CardTitle>
            <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Nova Senha</Label>
                    <Input 
                        id="password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirme a Nova Senha</Label>
                    <Input 
                        id="confirm-password" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                </div>
                <Button type="submit" className="w-full" disabled={status === 'resetting'}>
                    {status === 'resetting' ? 'Redefinindo...' : 'Salvar Nova Senha'}
                </Button>
            </form>
        </CardContent>
       </Card>
    )
  }

  return null;
}

export default function AuthActionPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <AuthActionHandler />
        </Suspense>
    )
}
