
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
  serverTimestamp,
  collectionGroup,
  orderBy,
  limit,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { Message, Conversation, User } from './types';

// NOTE: In a real-world scenario, you would have more robust user fetching.
// This is a simplified version to work without a full user management system for clients.
async function getClientData(clientId: string): Promise<Partial<User>> {
    // This is a simplified mock. In a real app, you'd fetch this from a 'users' or 'contacts' collection.
    return {
        id: clientId,
        name: `Client ${clientId.substring(0, 5)}`,
        avatarUrl: `https://placehold.co/100x100.png`
    }
}


export async function getConversationsForAgent(agentId: string): Promise<Conversation[]> {
  const conversationsCol = collection(db, 'conversations');
  const q = query(conversationsCol, where('agentId', '==', agentId), orderBy('updatedAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  const conversations: Conversation[] = [];

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const clientData = await getClientData(data.clientId);

    // Fetch last message for preview
    const messagesCol = collection(db, 'conversations', docSnap.id, 'messages');
    const lastMessageQuery = query(messagesCol, orderBy('timestamp', 'desc'), limit(1));
    const lastMessageSnapshot = await getDocs(lastMessageQuery);
    const lastMessage = lastMessageSnapshot.docs[0]?.data() || null;

    conversations.push({
      id: docSnap.id,
      clientId: data.clientId,
      agentId: data.agentId,
      status: data.status,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      clientName: clientData.name || 'Unknown Client',
      clientAvatarUrl: clientData.avatarUrl || 'https://placehold.co/100x100.png',
      lastMessage: lastMessage ? {
          content: lastMessage.content,
          timestamp: lastMessage.timestamp.toDate(),
          senderId: lastMessage.senderId,
      } : null,
      messages: [], // Messages will be fetched on-demand
    });
  }

  return conversations;
}

export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<void> {
    const conversationRef = doc(db, 'conversations', conversationId);
    const messagesRef = collection(conversationRef, 'messages');

    const batch = writeBatch(db);

    const newMessageRef = doc(messagesRef);
    const timestamp = serverTimestamp();

    batch.set(newMessageRef, {
        content,
        senderId,
        timestamp,
        status: 'sent',
    });
    
    batch.update(conversationRef, {
        updatedAt: timestamp,
        lastMessage: {
            content,
            senderId,
            timestamp
        }
    });

    await batch.commit();
}

export async function markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, where('senderId', '!=', userId), where('status', '!=', 'read'));

    const snapshot = await getDocs(q);
    if(snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { status: 'read' });
    });

    await batch.commit();
}
