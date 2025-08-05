
'use client';

import { useState } from 'react';
import { formatDistanceToNow, toDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, User, Users, Settings, FileText, LogOut, PlusCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
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

  const TriggerIcon = state === 'collapsed' ? ChevronRight : ChevronLeft;

  const formatTimestamp = (timestamp: any): Date => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    return toDate(timestamp || new Date());
  }

  return (
    <>
      <SidebarHeader>
        <div className={cn("flex flex-col gap-2", state === 'collapsed' && "items-center")}>
          <div className={cn("flex items-center gap-1", state === 'collapsed' && "flex-col")}>
             <Dialog open={openNewChatDialog} onOpenChange={setOpenNewChatDialog}>
              <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <PlusCircle className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={cn(state === 'expanded' && 'hidden')}>
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

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/contacts" passHref>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                </Link>
              </TooltipTrigger>
               <TooltipContent side="right" className={cn(state === 'expanded' && 'hidden')}>
                  <p>Contatos</p>
                </TooltipContent>
            </Tooltip>
          </div>
        
          <div className={cn("flex items-center gap-2", state === 'collapsed' && "hidden")}>
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
                  className={cn(
                    "w-full h-auto justify-start p-2 gap-3",
                    state === 'collapsed' && "data-[active=true]:bg-transparent"
                  )}
                  tooltip={conv.clientName}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conv.clientAvatarUrl} alt={conv.clientName} />
                      <AvatarFallback>{conv.clientName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                     {unreadCount > 0 && state === 'collapsed' && (
                        <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-primary ring-2 ring-background" />
                      )}
                  </div>
                  <div className={cn("flex flex-col items-start text-left flex-grow truncate", state === 'collapsed' && "hidden")}>
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
                  {unreadCount > 0 && state === 'expanded' && (
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
        <div className={cn("flex flex-col gap-2 w-full")}>
            <div className={cn(state === 'collapsed' && "hidden", "px-2")}>
              <Link href="/templates" passHref>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  <span className={cn(state === 'collapsed' && "hidden")}>Templates</span>
                </Button>
              </Link>
            </div>

             <Separator />
              <div className={cn("flex items-center p-2", state === 'collapsed' ? 'justify-center' : 'justify-between w-full')}>
                <div className={cn("flex-grow", state === 'collapsed' && "hidden")}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-3 w-full justify-start p-2 h-auto">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
                            <AvatarFallback>{loggedInUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        <div className="flex flex-col items-start flex-grow truncate">
                          <span className="font-semibold text-foreground text-sm truncate">{loggedInUser.name}</span>
                          <span className="text-xs text-muted-foreground truncate">{loggedInUser.email}</span>
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
                </div>
                <SidebarTrigger className={cn("h-7 w-7 shrink-0", state === 'expanded' && 'hidden md:flex')} >
                   <TriggerIcon />
                </SidebarTrigger>
              </div>
        </div>
      </SidebarFooter>
    </>
  );
}
