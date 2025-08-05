
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

interface ChatLayoutProps {
  loggedInUser: User;
}

export default function ChatLayout({ loggedInUser }: ChatLayoutProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

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
      <div className="flex h-screen w-full">
        <Sidebar className="h-full" collapsible="icon">
          <ConversationList
            conversations={allConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            loggedInUser={loggedInUser}
          />
        </Sidebar>
        <SidebarInset className="flex-1 relative">
          <ChatView
            conversation={enrichedSelectedConversation}
            conversations={allConversations}
            loggedInUser={loggedInUser}
            onSendMessage={handleSendMessage}
            isLoadingMessages={loadingMessages}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
