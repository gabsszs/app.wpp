
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Conversation, User } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { ConversationList } from './conversation-list';
import { ChatView } from './chat-view';
import { sendMessage, markMessagesAsRead, createOrGetConversationByPhone } from '@/lib/firestore';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';


interface ChatLayoutProps {
  loggedInUser: User;
}

export default function ChatLayout({ loggedInUser }: ChatLayoutProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isContactsDialogOpen, setIsContactsDialogOpen] = useState(false);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const { toast } = useToast();

  // State for the new chat form
  const [phoneDDI, setPhoneDDI] = useState('+55');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [isCreatingChat, setIsCreatingChat] = useState(false);


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
  
  // Effect to select a conversation when its ID is available
  useEffect(() => {
    const newConvId = sessionStorage.getItem('select-conv-id');
    if (newConvId && conversations) {
      const convToSelect = conversations.find(c => c.id === newConvId);
      if (convToSelect) {
        setSelectedConversation(convToSelect as Conversation);
        sessionStorage.removeItem('select-conv-id');
      }
    }
  }, [conversations]);


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

  const handleCreateNewChat = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!phoneNumber) return;
    setIsCreatingChat(true);

    try {
      const fullPhoneNumber = `${phoneDDI}${phoneNumber}`;
      const newConversationId = await createOrGetConversationByPhone(loggedInUser.id, fullPhoneNumber, contactName);

      // We use sessionStorage because the conversations list is updated via a real-time listener.
      // We can't immediately select the conversation as it might not be in the local state yet.
      // So we store the ID and an effect will pick it up and select it once it appears.
      sessionStorage.setItem('select-conv-id', newConversationId);
      
      // Reset form and close dialog
      setPhoneNumber('');
      setContactName('');
      setIsNewChatDialogOpen(false);

    } catch (error) {
      console.error("Error creating new chat:", error);
      toast({
        title: "Erro ao Criar Conversa",
        description: "Não foi possível iniciar uma nova conversa. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingChat(false);
    }
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
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <div className="flex gap-2">
                                <Select value={phoneDDI} onValueChange={setPhoneDDI}>
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue placeholder="DDI" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectItem value="+55">+55</SelectItem>
                                    <SelectItem value="+1">+1</SelectItem>
                                    <SelectItem value="+351">+351</SelectItem>
                                    <SelectItem value="+44">+44</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                                </Select>
                                <Input 
                                    id="phone" 
                                    placeholder="DDD + Número" 
                                    className="flex-1" 
                                    required 
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    disabled={isCreatingChat}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome (Opcional)</Label>
                             <Input 
                                id="name" 
                                placeholder="Nome do contato" 
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                disabled={isCreatingChat}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isCreatingChat}>
                            {isCreatingChat ? 'Iniciando...' : 'Iniciar Conversa'}
                        </Button>
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
