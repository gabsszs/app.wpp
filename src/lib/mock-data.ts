
import type { User, Conversation } from './types';
import { Timestamp } from 'firebase/firestore';

// THIS FILE IS NOW DEPRECATED FOR CHAT FUNCTIONALITY but kept for other pages if needed.

export const users: User[] = [
  {
    id: 'user-client-1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'client',
    status: 'online',
    company: 'Cliente VIP',
  },
  {
    id: 'user-client-2',
    name: 'João Pereira',
    email: 'joao.pereira@email.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'client',
    status: 'offline',
    company: 'Cliente Padrão',
  },
  {
    id: 'user-client-3',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'client',
    status: 'online',
    company: 'Cliente Padrão',
  },
  {
    id: 'user-agent-1',
    name: 'Carlos Oliveira',
    email: 'agent1@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'agent',
    status: 'online',
    company: 'ConectaZap',
  },
  {
    id: 'user-agent-2',
    name: 'Sofia Rodrigues',
    email: 'agent2@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'agent',
    status: 'offline',
    company: 'ConectaZap',
  },
  {
    id: 'user-admin-1',
    name: 'Lucas Martins',
    email: 'admin@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'admin',
    status: 'online',
    company: 'ConectaZap',
  },
];

export const conversations: Conversation[] = []; // No longer used for chat
