
'use client';

import { Check, CheckCheck, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Message, MessageStatus, User } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
  sender?: User;
  loggedInUserId: string;
}

const MessageStatusIndicator = ({ status }: { status: MessageStatus }) => {
  if (status === 'sending') {
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
  if (status === 'read') {
    return <CheckCheck className="h-4 w-4 text-primary" />;
  }
  if (status === 'delivered') {
    return <CheckCheck className="h-4 w-4 text-muted-foreground" />;
  }
  return <Check className="h-4 w-4 text-muted-foreground" />;
};

export function MessageBubble({ message, sender, loggedInUserId }: MessageBubbleProps) {
  const isMyMessage = message.senderId === loggedInUserId;

  return (
    <div
      className={cn('flex flex-col', {
        'items-end': isMyMessage,
        'items-start': !isMyMessage,
      })}
    >
      <div
        className={cn('flex items-end gap-2', {
          'justify-end': isMyMessage,
          'justify-start': !isMyMessage,
        })}
      >
        <div
          className={cn('max-w-md rounded-2xl px-4 py-3', {
            'bg-primary text-primary-foreground': isMyMessage,
            'bg-card shadow-sm border': !isMyMessage,
          })}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          <div className="mt-1 flex items-center justify-end gap-2">
            {isMyMessage && sender && (
                <span className="text-xs opacity-70 mr-auto">{sender.name}</span>
            )}
            <span className="text-xs opacity-70">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
            {isMyMessage && <MessageStatusIndicator status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
}
