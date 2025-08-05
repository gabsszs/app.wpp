
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building, Users, ShieldCheck, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
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
  useSidebar,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"


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

function SettingsSidebarContent() {
    const pathname = usePathname();
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const { toast } = useToast();
    const { state } = useSidebar();

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
        <>
            <SidebarHeader>
                 {/* O botão foi removido daqui */}
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
                                <span className={cn(state === 'collapsed' && "hidden")}>{item.title}</span>
                            </SidebarMenuButton>
                         </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
             <SidebarFooter>
                <Separator />
                <div className={cn("flex p-2", state === 'collapsed' ? 'justify-center' : 'justify-between items-center w-full')}>
                    {loading ? (
                        <div className={cn("flex items-center gap-2", state === 'collapsed' && "hidden")}>
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="flex flex-col gap-1 w-24">
                               <Skeleton className="h-4 w-3/4" />
                               <Skeleton className="h-3 w-full" />
                            </div>
                        </div>
                    ) : user ? (
                       <div className={cn(state === 'collapsed' && "hidden")}>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex-grow justify-start p-2 h-auto">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start flex-grow truncate ml-2">
                                        <span className="font-semibold text-foreground text-sm truncate">{user.displayName}</span>
                                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                    </div>
                                </Button>
                           </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                                <DropdownMenuLabel className="font-normal">
                                  <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                      {user.email}
                                    </p>
                                  </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/chat">
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        <span>Voltar para o Chat</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sair</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                       </div>
                    ): null}
                    
                    <SidebarTrigger className="shrink-0">
                        {state === 'expanded' ? <ChevronLeft /> : <ChevronRight />}
                    </SidebarTrigger>
                </div>
             </SidebarFooter>
        </>
    )
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider defaultOpen>
       <div className="flex h-screen w-full bg-muted/40">
        <Sidebar className="h-full flex flex-col" collapsible="icon">
            <SettingsSidebarContent />
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
