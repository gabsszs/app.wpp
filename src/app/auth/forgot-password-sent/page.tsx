'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MailCheck } from 'lucide-react';

export default function ForgotPasswordSentPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="mt-4 text-3xl font-bold">Verifique seu E-mail</CardTitle>
        <CardDescription>
          Se o endereço de e-mail estiver em nosso sistema, você receberá um link para redefinir sua senha.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-6">
          Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente mais tarde.
        </p>
        <Button asChild className="w-full">
          <Link href="/auth/login">Voltar para o Login</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
