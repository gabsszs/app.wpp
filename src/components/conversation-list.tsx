
'use client';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, User, Users, Settings, FileText } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Conversation, User as TUser } from '@/lib/types';
import { users } from '@/lib/mock-data';
import Link from 'next/link';

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

  const getClient = (clientId: string) => users.find(u => u.id === clientId);

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
            <AvatarFallback>{loggedInUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{loggedInUser.name}</span>
            <span className="text-sm text-muted-foreground">{loggedInUser.email}</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar conversas..." className="pl-8" />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).map((conv) => {
            const client = getClient(conv.clientId);
            const lastMessage = conv.messages[conv.messages.length - 1];
            return (
              <SidebarMenuItem key={conv.id}>
                <SidebarMenuButton
                  onClick={() => onSelectConversation(conv)}
                  isActive={selectedConversation?.id === conv.id}
                  className={cn(
                    "w-full h-auto justify-start p-2",
                    selectedConversation?.id === conv.id && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
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
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Link href="/contacts" passHref>
          <Button variant="outline" className="w-full justify-start gap-2">
            <User className="h-4 w-4" />
            <span>Contatos</span>
          </Button>
        </Link>
        {loggedInUser.role !== 'agent' && (
          <>
            <Link href="/templates" passHref>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                <span>Templates</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              <span>Equipes</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </Button>
          </>
        )}
      </SidebarFooter>
    </>
  );
}
