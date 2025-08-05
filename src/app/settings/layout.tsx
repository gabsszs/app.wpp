
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, Users, ShieldCheck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
} from '@/components/ui/sidebar';

const sidebarNavItems = [
  {
    title: 'Perfil da Empresa',
    href: '/settings/profile',
    icon: <Building />,
  },
  {
    title: 'Equipes',
    href: '/settings/teams',
    icon: <Users />,
  },
  {
    title: 'Usuários',
    href: '/settings/users',
    icon: <Users />,
  },
  {
    title: 'Funções e Permissões',
    href: '/settings/roles',
    icon: <ShieldCheck />,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
       <div className="flex h-screen w-full bg-muted/40">
        <Sidebar className="h-full" collapsible="icon">
             <SidebarHeader>
                 <Button asChild variant="ghost" className="w-full justify-start gap-2">
                    <Link href="/chat">
                        <Home className="h-5 w-5" />
                        <span>Voltar para o Chat</span>
                    </Link>
                 </Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {sidebarNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                         <Link href={item.href} className="w-full">
                            <SidebarMenuButton
                                isActive={pathname === item.href}
                                className="w-full justify-start gap-3"
                                tooltip={item.title}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                         </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
                 <h1 className="text-xl font-semibold">Configurações</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
               <div className="w-full max-w-4xl mx-auto">{children}</div>
            </main>
        </SidebarInset>
       </div>
    </SidebarProvider>
  );
}
