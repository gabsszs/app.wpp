
'use client';

import { Check, CheckCheck, Clock, StickyNote } from 'lucide-react';
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
  
  if(message.type === 'note') {
    return (
        <div className="flex items-center justify-center my-2">
            <div className="flex items-start gap-3 rounded-lg bg-amber-100 border border-amber-200 text-amber-900 px-4 py-3 max-w-xl mx-auto shadow-sm">
                <StickyNote className="h-5 w-5 mt-1 flex-shrink-0" />
                <div className="flex-grow">
                    <p className="text-sm font-semibold">Nota Interna</p>
                    <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
                     <div className="mt-1 flex items-center justify-end gap-2 self-end">
                        <span className="text-xs opacity-70">
                            {format(formatTimestamp(message.timestamp), 'HH:mm')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
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
