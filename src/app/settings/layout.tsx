
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, Users, ShieldCheck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const sidebarNavItems = [
  {
    title: 'Perfil da Empresa',
    href: '/settings/profile',
    icon: <Building className="h-5 w-5" />,
  },
  {
    title: 'Equipes',
    href: '/settings/teams',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Usuários',
    href: '/settings/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Funções e Permissões',
    href: '/settings/roles',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <h1 className="text-2xl font-bold">Configurações</h1>
             <Button asChild variant="outline" className="ml-auto gap-1">
                <Link href="/chat">
                    <Home className="h-4 w-4" />
                    Voltar para o Chat
                </Link>
             </Button>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
            <Card className="hidden h-fit md:block">
                <nav className="grid gap-1 p-2">
                    {sidebarNavItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                        variant="ghost"
                        className={cn(
                            'w-full justify-start gap-3',
                            pathname === item.href
                            ? 'bg-muted font-semibold text-primary'
                            : 'font-normal'
                        )}
                        >
                        {item.icon}
                        {item.title}
                        </Button>
                    </Link>
                    ))}
                </nav>
            </Card>
            <div className="w-full">{children}</div>
        </main>
       </div>
    </div>
  );
}
