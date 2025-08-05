
'use client';

import { Check, CheckCheck, Clock } from 'lucide-react';
import { format, toDate } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Message, MessageStatus, User } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
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

export function MessageBubble({ message, loggedInUserId }: MessageBubbleProps) {
  const isMyMessage = message.senderId === loggedInUserId;

  const formatTimestamp = (timestamp: any): Date => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    return toDate(timestamp || new Date());
  }
  
  return (
    <div
      className={cn('flex flex-col', {
        'items-end': isMyMessage,
        'items-start': !isMyMessage,
      })}
    >
      <div
        className={cn('flex max-w-md flex-col rounded-2xl px-4 py-3', {
          'bg-primary text-primary-foreground': isMyMessage,
          'bg-card shadow-sm border': !isMyMessage,
        })}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className="mt-1 flex items-center justify-end gap-2 self-end">
          <span className="text-xs opacity-70">
            {format(formatTimestamp(message.timestamp), 'HH:mm')}
          </span>
          {isMyMessage && <MessageStatusIndicator status={message.status} />}
        </div>
      </div>
    </div>
  );
}
