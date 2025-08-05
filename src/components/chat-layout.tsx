
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Conversation, User } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { ConversationList } from './conversation-list';
import { ChatView } from './chat-view';
import { sendMessage, markMessagesAsRead } from '@/lib/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, query, where, orderBy, doc, collectionGroup } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { ContactsView } from './contacts-view';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface ChatLayoutProps {
  loggedInUser: User;
}

export default function ChatLayout({ loggedInUser }: ChatLayoutProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isContactsDialogOpen, setIsContactsDialogOpen] = useState(false);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);

  // Real-time conversations
  const conversationsQuery = query(
      collection(db, 'conversations'), 
      where('agentId', '==', loggedInUser.id), 
      orderBy('updatedAt', 'desc')
  );
  const [conversations, loadingConversations, errorConversations] = useCollectionData(conversationsQuery, { idField: 'id' });
  
  // Real-time messages for the selected conversation
   const messagesQuery = selectedConversation ? query(
      collection(db, 'conversations', selectedConversation.id, 'messages'),
      orderBy('timestamp', 'asc')
    ) : null;
  const [messages, loadingMessages, errorMessages] = useCollectionData(messagesQuery, { idField: 'id' });


  useEffect(() => {
    // Automatically select the first conversation on initial load
    if (conversations && conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0] as Conversation);
    }
     // If the selected conversation is deleted, or the list becomes empty, reset selection.
    if (conversations && selectedConversation && !conversations.find(c => c.id === selectedConversation.id)) {
        setSelectedConversation(conversations.length > 0 ? (conversations[0] as Conversation) : null);
    }
    if (conversations && conversations.length === 0) {
        setSelectedConversation(null);
    }
  }, [conversations, selectedConversation]);

  const handleSendMessage = async (conversationId: string, messageContent: string) => {
    if (!loggedInUser) return;
    try {
      await sendMessage(conversationId, loggedInUser.id, messageContent);
    } catch (error) {
        console.error("Error sending message:", error);
        // Optionally show a toast to the user
    }
  };
  
  const handleSelectConversation = useCallback(async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    try {
        await markMessagesAsRead(conversation.id, loggedInUser.id);
    } catch(error) {
        console.error("Error marking messages as read:", error);
    }
  }, [loggedInUser.id]);

  const handleCreateNewChat = (event: React.FormEvent) => {
    event.preventDefault();
    // Logic to create new chat here
    console.log("Novo chat criado!");
    setIsNewChatDialogOpen(false);
  }
  
  const enrichedSelectedConversation = selectedConversation ? {
      ...selectedConversation,
      messages: messages || [], // Combine conversation data with real-time messages
  } : null;

   if (loadingConversations) {
     return (
       <div className="flex h-screen w-full items-center justify-center">
         <div className="w-full max-w-4xl flex gap-4 p-4">
            <div className="w-1/3 space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
            <div className="w-2/3 space-y-2">
                <Skeleton className="h-full w-full" />
            </div>
         </div>
       </div>
     );
   }

  const allConversations = (conversations as Conversation[]) || [];

  return (
    <SidebarProvider defaultOpen>
        {/* Contacts Dialog */}
        <Dialog open={isContactsDialogOpen} onOpenChange={setIsContactsDialogOpen}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
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

        {/* New Chat Dialog */}
        <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
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


      <div className="flex h-screen w-full">
        <Sidebar className="h-full" collapsible="icon">
          <ConversationList
            conversations={allConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            loggedInUser={loggedInUser}
            onOpenContacts={() => setIsContactsDialogOpen(true)}
            onOpenNewChat={() => setIsNewChatDialogOpen(true)}
          />
        </Sidebar>
        <SidebarInset className="flex-1 relative">
          <ChatView
            conversation={enrichedSelectedConversation}
            conversations={allConversations}
            loggedInUser={loggedInUser}
            onSendMessage={handleSendMessage}
            isLoadingMessages={loadingMessages}
            onOpenContacts={() => setIsContactsDialogOpen(true)}
            onOpenNewChat={() => setIsNewChatDialogOpen(true)}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
