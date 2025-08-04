
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Phone, Video, Info, Paperclip, Image, FileText, MapPin, ChevronLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageBubble } from './message-bubble';
import type { Conversation, User } from '@/lib/types';
import { users } from '@/lib/mock-data';
import { getSuggestedResponse } from '@/ai/flows/suggested-response';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from '@/components/ui/sidebar';
import { format, isToday, isYesterday, differenceInCalendarDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ChatViewProps {
  conversation: Conversation | null;
  loggedInUser: User;
  onSendMessage: (conversationId: string, messageContent: string) => void;
}

export function ChatView({ conversation, loggedInUser, onSendMessage }: ChatViewProps) {
  const [message, setMessage] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const client = conversation ? users.find((u) => u.id === conversation.clientId) : null;
  const getSender = (senderId: string) => users.find(u => u.id === senderId);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversation?.messages, selectedDate]);
  
  const handleSend = () => {
    if (message.trim() && conversation) {
      onSendMessage(conversation.id, message);
      setMessage('');
    }
  };

  const handleSuggestion = async () => {
    if (!conversation || conversation.messages.length === 0) return;
    const lastCustomerMessage = [...conversation.messages].reverse().find(m => m.senderId !== loggedInUser.id);
    if (!lastCustomerMessage) {
       toast({
        title: "Nenhuma mensagem do cliente",
        description: "Não há mensagem do cliente para gerar uma sugestão.",
        variant: 'destructive',
      });
      return;
    };

    setIsSuggesting(true);
    try {
      const result = await getSuggestedResponse({ customerMessage: lastCustomerMessage.content });
      setMessage(result.suggestedResponse);
    } catch (error) {
      console.error('Error getting suggestion:', error);
      toast({
        title: "Erro na Sugestão",
        description: "Não foi possível gerar uma sugestão de resposta.",
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const formatSelectedDate = (date: Date | undefined): string => {
    if (!date) return "Escolha uma data";
    if (isToday(date)) return "Hoje";
    if (isYesterday(date)) return "Ontem";
    
    const diffDays = differenceInCalendarDays(new Date(), date);
    if (diffDays >= 1 && diffDays < 7) {
      const dayName = format(date, "eeee", { locale: ptBR });
      return dayName.charAt(0).toUpperCase() + dayName.slice(1);
    }

    return format(date, "PPP", { locale: ptBR });
  };

  if (!conversation || !client) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Bem-vindo ao ConectaZap</h2>
          <p className="text-muted-foreground">Selecione uma conversa para começar a conversar.</p>
        </div>
      </div>
    );
  }

  const filteredMessages = conversation.messages.filter(msg => 
    selectedDate ? format(new Date(msg.timestamp), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') : true
  );


  return (
    <div className="relative flex h-screen flex-col">
       <header className="flex items-center justify-between border-b bg-background p-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden">
            <ChevronLeft />
          </SidebarTrigger>
          <Avatar>
            <AvatarImage src={client.avatarUrl} alt={client.name} />
            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{client.name}</p>
            <p className="text-sm text-muted-foreground">{client.status}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "w-auto justify-center rounded-full bg-background/80 text-sm font-medium shadow-md backdrop-blur-sm hover:bg-muted",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatSelectedDate(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              locale={ptBR}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 pt-8">
          {filteredMessages.length > 0 ? (
             filteredMessages.map((msg) => {
              const sender = getSender(msg.senderId);
              return (
                <MessageBubble key={msg.id} message={msg} sender={sender} loggedInUserId={loggedInUser.id} />
              )
            })
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <p>Nenhuma mensagem em</p>
                <p className="font-medium">{formatSelectedDate(selectedDate)}</p>
              </div>
          )}
        </div>
      </ScrollArea>

      <footer className="border-t bg-background p-4">
        <Card className="rounded-2xl">
          <CardContent className="p-2">
            <div className="grid gap-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                className="resize-none border-0 shadow-none focus-visible:ring-0"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSuggestion}
                  disabled={isSuggesting}
                  className="gap-2 text-accent-foreground hover:text-accent-foreground"
                >
                  <Sparkles className="h-4 w-4 text-accent" />
                  {isSuggesting ? 'Gerando...' : 'Sugerir Resposta com IA'}
                </Button>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Image className="mr-2 h-4 w-4" />
                        <span>Fotos e Vídeos</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Documento</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Localização</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={handleSend} size="icon" disabled={!message.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}
