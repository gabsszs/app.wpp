
'use client';

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Conversation, User, Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PlusCircle, Tag, StickyNote, User as UserIcon, Building, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { format, toDate } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientProfileSheetProps {
    conversation: (Conversation & { messages: Message[] }) | null;
    agent: User | null;
}

export function ClientProfileSheet({ conversation, agent }: ClientProfileSheetProps) {
    if (!conversation) return null;

    const internalNotes = conversation.messages.filter(msg => msg.type === 'note');

    const formatTimestamp = (timestamp: any): Date | null => {
        if (!timestamp) return null;
        if (timestamp instanceof Date) return timestamp;
        if (typeof timestamp.toDate === 'function') return timestamp.toDate();
        return toDate(timestamp);
    }

    return (
        <SheetContent side="right" className="p-0 sm:max-w-md w-full flex flex-col gap-0 border-l">
            <ScrollArea className="flex-1">
                <div className="p-6">
                    <SheetHeader className="text-left mb-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16 border-2 border-primary">
                                <AvatarImage src={conversation.clientAvatarUrl} alt={conversation.clientName} />
                                <AvatarFallback>{conversation.clientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <SheetTitle className="text-2xl">{conversation.clientName}</SheetTitle>
                                <SheetDescription>
                                    ID do Cliente: {conversation.clientId}
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="space-y-6">
                        {/* Responsible Agent */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <UserIcon className="w-5 h-5" />
                                    Responsável
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={agent?.avatarUrl} alt={agent?.name} />
                                        <AvatarFallback>{agent?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{agent?.name}</p>
                                        <p className="text-sm text-muted-foreground">{agent?.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Tag className="w-5 h-5" />
                                    Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {conversation.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <button className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
                                        </Badge>
                                    ))}
                                        <Button variant="ghost" size="sm" className="gap-1 text-primary">
                                        <PlusCircle className="w-4 h-4" />
                                        Adicionar Tag
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                            {/* Custom Fields */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Building className="w-5 h-5" />
                                    Campos Personalizados
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                    <div className="text-center text-muted-foreground py-4">
                                    <p>Nenhum campo personalizado definido.</p>
                                    <p className="text-xs">(Em breve, o gestor poderá adicionar campos aqui)</p>
                                </div>
                            </CardContent>
                        </Card>


                        {/* Internal Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <StickyNote className="w-5 h-5" />
                                    Notas Internas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {internalNotes.length > 0 ? (
                                    <div className="space-y-4">
                                        {internalNotes.map(note => {
                                            const formattedDate = formatTimestamp(note.timestamp);
                                            return (
                                            <div key={note.id} className="text-sm p-3 bg-muted/50 rounded-md">
                                                    <p className="whitespace-pre-wrap break-words">{note.content}</p>
                                                    {formattedDate && (
                                                        <p className="text-xs text-muted-foreground mt-1 text-right">
                                                        {format(formattedDate, 'dd/MM/yyyy HH:mm')}
                                                        </p>
                                                    )}
                                            </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-4">
                                    <p>Nenhuma nota interna para esta conversa.</p>
                                </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>
        </SheetContent>
    );
}
