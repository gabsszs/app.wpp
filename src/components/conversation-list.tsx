
'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, User, Users, Settings, FileText, LogOut, PlusCircle } from 'lucide-react';
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
import { users } from '@/lib/mock-data';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';


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
  const getClient = (clientId: string) => users.find(u => u.id === clientId);
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);

  const getUnreadCount = (messages: Message[]) => {
    return messages.filter(m => m.senderId !== loggedInUser.id && m.status !== 'read').length;
  }

  const handleCreateNewChat = (event: React.FormEvent) => {
    event.preventDefault();
    // Lógica para criar novo chat aqui
    console.log("Novo chat criado!");
    setOpenNewChatDialog(false);
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <h2 className={cn("text-xl font-bold", state === 'collapsed' && "hidden")}>Conversas</h2>
          <div className="flex items-center">
            <Dialog open={openNewChatDialog} onOpenChange={setOpenNewChatDialog}>
              <DialogTrigger asChild>
                 <Button variant="ghost" size="icon">
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
            <Link href="/contacts" passHref>
               <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
               </Button>
            </Link>
          </div>
        </div>
        <div className={cn("relative", state === 'collapsed' && "hidden")}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar conversas..." className="pl-8" />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className='p-2'>
        <SidebarMenu>
          {conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).map((conv) => {
            const client = getClient(conv.clientId);
            const lastMessage = conv.messages[conv.messages.length - 1];
            const unreadCount = getUnreadCount(conv.messages);
            return (
              <SidebarMenuItem key={conv.id}>
                <SidebarMenuButton
                  onClick={() => onSelectConversation(conv)}
                  isActive={selectedConversation?.id === conv.id}
                  className="w-full h-auto justify-start p-2 gap-3"
                  tooltip={client?.name}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={client?.avatarUrl} alt={client?.name} />
                    <AvatarFallback>{client?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left flex-grow truncate">
                    <div className="flex justify-between w-full">
                      <p className="font-semibold">{client?.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true, locale: ptBR })}
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
        <div className={cn("flex flex-col gap-2", state === 'collapsed' && "items-center")}>
            {loggedInUser.role !== 'agent' && (
              <>
                <Link href="/templates" passHref>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    <span className={cn(state === 'collapsed' && "hidden")}>Templates</span>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  <span className={cn(state === 'collapsed' && "hidden")}>Equipes</span>
                </Button>
              </>
            )}
             <Separator />
            <div className={cn("flex items-center w-full", state === 'collapsed' ? 'justify-center' : 'justify-between')}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("flex items-center gap-3 w-full", state === 'collapsed' ? 'justify-center p-2' : 'justify-start p-2')}>
                    <Avatar className={cn("h-8 w-8", state === 'collapsed' && "hidden")}>
                      <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
                      <AvatarFallback>{loggedInUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={cn("flex flex-col items-start", state === 'collapsed' && "hidden")}>
                      <span className="font-semibold text-foreground text-sm">{loggedInUser.name}</span>
                      <span className="text-xs text-muted-foreground">{loggedInUser.email}</span>
                    </div>
                     <div className={cn(state !== 'collapsed' && "hidden")}>
                      <Settings className="h-5 w-5" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 mb-2" align="end" sideOffset={10}>
                   <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{loggedInUser.company}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {loggedInUser.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
                <SidebarTrigger className={cn("hidden md:flex", state === 'collapsed' && "hidden")} />
            </div>
        </div>
      </SidebarFooter>
    </>
  );
}
