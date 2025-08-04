export type Role = 'super-admin' | 'admin' | 'agent' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  status: 'online' | 'offline';
  company: string;
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  clientId: string;
  agentId?: string;
  status: 'open' | 'pending' | 'closed';
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
