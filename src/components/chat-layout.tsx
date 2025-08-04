'use client';

import { useState } from 'react';
import type { Conversation, User } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
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
        // Mark messages as read
        const updatedMessages = conv.messages.map(m => ({ ...m, status: 'read' as const }));

        const updatedConv = {
          ...conv,
          messages: [...updatedMessages, newMessage],
          updatedAt: new Date(),
        };
        setSelectedConversation(updatedConv);
        return updatedConv;
      }
      return conv;
    });
    setLocalConversations(updatedConversations);
  };
  
  const handleSelectConversation = (conversation: Conversation) => {
    // When a conversation is selected, mark all its messages from the other user as read
    const updatedConversations = localConversations.map((conv) => {
      if (conv.id === conversation.id) {
        return {
          ...conv,
          messages: conv.messages.map(m =>
            m.senderId !== loggedInUser.id ? { ...m, status: 'read' as const } : m
          ),
        };
      }
      return conv;
    });
    setLocalConversations(updatedConversations);
    setSelectedConversation(conversation);
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full">
        <Sidebar className="h-full" collapsible="icon">
          <ConversationList
            conversations={localConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            loggedInUser={loggedInUser}
          />
        </Sidebar>
        <SidebarInset className="flex-1 relative">
          <div className='absolute top-4 left-4 z-20'>
            <SidebarTrigger />
          </div>
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
