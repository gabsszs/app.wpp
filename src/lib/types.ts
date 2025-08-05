
import type { Timestamp } from 'firebase/firestore';

export type Role = 'super-admin' | 'admin' | 'agent' | 'client';

export interface User {
  id: string; // Corresponds to Firebase Auth UID for agents/admins, or Firestore doc ID for clients
  name: string;
  email: string; // Optional for clients
  phone?: string; // Key identifier for clients
  avatarUrl: string;
  role: Role;
  status: 'online' | 'offline';
  company: string;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
export type MessageType = 'message' | 'note';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // UID of agent or ID of client
  content: string;
  timestamp: Timestamp | Date; // Use Firebase Timestamp
  status: MessageStatus;
  type: MessageType;
}

export interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatarUrl: string;
  agentId?: string;
  status: 'open' | 'pending' | 'closed';
  messages: Message[]; // This will likely be a subcollection, not an array in the doc
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  lastMessage: {
    content: string;
    timestamp: Timestamp | Date;
    senderId: string;
  } | null;
}
