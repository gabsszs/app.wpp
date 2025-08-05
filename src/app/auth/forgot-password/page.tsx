'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call for password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: 'Email Enviado',
        description: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.',
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Recuperar Senha</CardTitle>
        <CardDescription>
          {isSubmitted
            ? 'Verifique sua caixa de entrada.'
            : 'Digite seu e-mail para receber o link de redefinição.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center">
            <p className="text-muted-foreground">
              Não recebeu o email? Verifique sua pasta de spam ou tente novamente mais tarde.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Link'}
            </Button>
          </form>
        )}
        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para o Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
