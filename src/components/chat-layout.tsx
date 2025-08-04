'use client';

import { useState } from 'react';
import type { Conversation, User } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { ConversationList } from './conversation-list';
import { ChatView } from './chat-view';

interface ChatLayoutProps {
  conversations: Conversation[];
  loggedInUser: User;
}

export default function ChatLayout({ conversations, loggedInUser }: ChatLayoutProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
  const [localConversations, setLocalConversations] = useState<Conversation[]>(conversations);

  const handleSendMessage = (conversationId: string, messageContent: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: loggedInUser.id,
      content: messageContent,
      timestamp: new Date(),
      status: 'sent' as const,
    };

    const updatedConversations = localConversations.map((conv) => {
      if (conv.id === conversationId) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, newMessage],
          updatedAt: new Date(),
        };
        setSelectedConversation(updatedConv);
        return updatedConv;
      }
      return conv;
    });
    setLocalConversations(updatedConversations);
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full">
        <Sidebar className="h-full" collapsible="icon">
          <ConversationList
            conversations={localConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            loggedInUser={loggedInUser}
          />
        </Sidebar>
        <SidebarInset className="flex-1">
          <ChatView
            conversation={selectedConversation}
            loggedInUser={loggedInUser}
            onSendMessage={handleSendMessage}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
