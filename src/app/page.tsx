import ChatLayout from '@/components/chat-layout';
import { conversations, users } from '@/lib/mock-data';

export default function Home() {
  // In a real app, you'd fetch the logged-in user's data
  const loggedInUser = users.find((user) => user.email === 'agent1@example.com');
  if (!loggedInUser) {
    return <div>Error: Logged in user not found.</div>;
  }
  return <ChatLayout conversations={conversations} loggedInUser={loggedInUser} />;
}
