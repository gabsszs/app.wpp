
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building, Users, ShieldCheck, Home, LogOut } from 'lucide-react';
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth/login');
      toast({ title: 'Você saiu!', description: 'Até a próxima!' });
    } catch (error) {
      toast({ title: 'Erro ao sair', description: 'Não foi possível fazer o logout. Tente novamente.', variant: 'destructive' });
    }
  };


  return (
    <SidebarProvider defaultOpen>
       <div className="flex h-screen w-full bg-muted/40">
        <Sidebar className="h-full flex flex-col" collapsible="icon">
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
             <SidebarFooter>
                <Separator />
                 {loading ? (
                    <div className="flex items-center gap-2 p-2">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex flex-col gap-1 w-full">
                           <Skeleton className="h-4 w-3/4" />
                           <Skeleton className="h-3 w-full" />
                        </div>
                    </div>
                ) : user ? (
                    <div className="flex items-center gap-2 p-2">
                         <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col w-full truncate">
                            <span className="font-semibold text-foreground text-sm truncate">{user.displayName}</span>
                            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0" onClick={handleSignOut}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                ): null}
             </SidebarFooter>
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
