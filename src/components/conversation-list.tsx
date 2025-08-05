
'use client';

import { useState } from 'react';
import { formatDistanceToNow, toDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Settings, LogOut, PlusCircle, ChevronLeft, ChevronRight, Filter, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Conversation, User as TUser, Message } from '@/lib/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ContactsView } from './contacts-view';


interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  loggedInUser: TUser;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  loggedInUser,
}: ConversationListProps) {
  const { state } = useSidebar();
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
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


  // This needs to be replaced with real-time data
  const getUnreadCount = (messages: Message[]) => {
    // This logic is flawed without real-time message fetching per conversation
    return 0;
  }

  const handleCreateNewChat = (event: React.FormEvent) => {
    event.preventDefault();
    // Logic to create new chat here
    console.log("Novo chat criado!");
    setOpenNewChatDialog(false);
  }

  const formatTimestamp = (timestamp: any): Date => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    return toDate(timestamp || new Date());
  }

  return (
    <>
      {state === 'expanded' && (
        <div className="flex flex-col h-full">
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">Conversas</h2>
              </div>
              <div className="flex items-center gap-1">
                <Dialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="shrink-0">
                                    <Users className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Contatos</p>
                        </TooltipContent>
                    </Tooltip>
                    <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                      <div className="p-6 pb-0">
                        <DialogHeader>
                          <div className="flex items-center justify-between">
                            <div className='space-y-1'>
                                <DialogTitle className="text-2xl">Contatos</DialogTitle>
                                <DialogDescription>
                                    Gerencie seus clientes e inicie novas conversas.
                                </DialogDescription>
                            </div>
                            <Button>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Adicionar Contato
                            </Button>
                          </div>
                        </DialogHeader>
                      </div>
                      <div className="flex-1 flex flex-col min-h-0">
                        <ContactsView />
                      </div>
                    </DialogContent>
                </Dialog>
                <Dialog open={openNewChatDialog} onOpenChange={setOpenNewChatDialog}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                        <p>Nova Conversa</p>
                        </TooltipContent>
                    </Tooltip>
                    <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Iniciar Nova Conversa</DialogTitle>
                        <DialogDescription>
                        Digite o número de telefone para iniciar uma conversa.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateNewChat}>
                        <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                            Telefone
                            </Label>
                            <Input id="phone" placeholder="Número com código do país" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Nome
                            </Label>
                            <Input id="name" placeholder="Nome do contato (Opcional)" className="col-span-3" />
                        </div>
                        </div>
                        <DialogFooter>
                        <Button type="submit">Iniciar Conversa</Button>
                        </DialogFooter>
                    </form>
                    </DialogContent>
                </Dialog>
              </div>
            </div>
          
            <div className="flex items-center gap-2 px-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar conversas..." className="pl-8" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Data</DropdownMenuItem>
                        <DropdownMenuItem>Não respondida</DropdownMenuItem>
                        <DropdownMenuItem>Grupo</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </SidebarHeader>
          <Separator />
          <SidebarContent className='p-2'>
            <SidebarMenu>
              {conversations.map((conv) => {
                const lastMessage = conv.lastMessage;
                const unreadCount = 0; // Needs real-time logic
                return (
                  <SidebarMenuItem key={conv.id}>
                    <SidebarMenuButton
                      onClick={() => onSelectConversation(conv)}
                      isActive={selectedConversation?.id === conv.id}
                      className="w-full h-auto justify-start p-2 gap-3"
                      tooltip={conv.clientName}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conv.clientAvatarUrl} alt={conv.clientName} />
                          <AvatarFallback>{conv.clientName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-primary ring-2 ring-background" />
                          )}
                      </div>
                      <div className="flex flex-col items-start text-left flex-grow truncate">
                        <div className="flex justify-between w-full">
                          <p className="font-semibold">{conv.clientName}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(formatTimestamp(conv.updatedAt), { addSuffix: true, locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate w-full">
                          {lastMessage?.content}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                          {unreadCount}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Separator />
            <div className="flex p-2 justify-between items-center w-full">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex-grow justify-start p-2 h-auto">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
                                <AvatarFallback>{loggedInUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start flex-grow truncate ml-2">
                                <span className="font-semibold text-foreground text-sm truncate">{loggedInUser.name}</span>
                                <span className="text-xs text-muted-foreground truncate">{loggedInUser.email}</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{loggedInUser.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {loggedInUser.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Configurações</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              
                <SidebarTrigger className="shrink-0" >
                    <ChevronLeft />
                </SidebarTrigger>
            </div>
          </SidebarFooter>
        </div>
      )}

      {state === 'collapsed' && (
         <div className="flex flex-col h-full items-center">
            <SidebarHeader className="p-2">
                <div className="flex flex-col items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="shrink-0">
                                        <Users className="h-5 w-5" />
                                    </Button>
                                </DialogTrigger>
                                 <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                                    <div className="p-6 pb-0">
                                    <DialogHeader>
                                        <div className="flex items-center justify-between">
                                            <div className='space-y-1'>
                                                <DialogTitle className="text-2xl">Contatos</DialogTitle>
                                                <DialogDescription>
                                                    Gerencie seus clientes e inicie novas conversas.
                                                </DialogDescription>
                                            </div>
                                            <Button>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Adicionar Contato
                                            </Button>
                                        </div>
                                    </DialogHeader>
                                    </div>
                                    <div className="flex-1 flex flex-col min-h-0">
                                        <ContactsView />
                                    </div>
                                </DialogContent>
                           </Dialog>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                        <p>Contatos</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <Dialog open={openNewChatDialog} onOpenChange={setOpenNewChatDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="shrink-0">
                                        <PlusCircle className="h-5 w-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Iniciar Nova Conversa</DialogTitle>
                                    <DialogDescription>
                                    Digite o número de telefone para iniciar uma conversa.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateNewChat}>
                                    <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phone" className="text-right">
                                        Telefone
                                        </Label>
                                        <Input id="phone" placeholder="Número com código do país" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                        Nome
                                        </Label>
                                        <Input id="name" placeholder="Nome do contato (Opcional)" className="col-span-3" />
                                    </div>
                                    </div>
                                    <DialogFooter>
                                    <Button type="submit">Iniciar Conversa</Button>
                                    </DialogFooter>
                                </form>
                                </DialogContent>
                            </Dialog>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                        <p>Nova Conversa</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </SidebarHeader>
            <Separator />
            <SidebarContent className='p-2'>
                <SidebarMenu>
                    {conversations.map((conv) => (
                        <SidebarMenuItem key={conv.id}>
                        <SidebarMenuButton
                            onClick={() => onSelectConversation(conv)}
                            isActive={selectedConversation?.id === conv.id}
                            className="w-full h-auto justify-center p-2 gap-3"
                            tooltip={conv.clientName}
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={conv.clientAvatarUrl} alt={conv.clientName} />
                                <AvatarFallback>{conv.clientName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="w-full">
                <Separator />
                <div className="flex flex-col p-2 gap-2 items-center w-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
                                    <AvatarFallback>{loggedInUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mb-2" side="right" align="center">
                            <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{loggedInUser.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                {loggedInUser.email}
                                </p>
                            </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Configurações</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                
                    <SidebarTrigger className="shrink-0">
                        <ChevronRight />
                    </SidebarTrigger>
                </div>
            </SidebarFooter>
        </div>
      )}
    </>
  );
}
