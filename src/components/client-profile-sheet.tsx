
'use client';

import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
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
    onClose: () => void;
}

export function ClientProfileSheet({ conversation, agent, onClose }: ClientProfileSheetProps) {
    if (!conversation) return null;

    const internalNotes = conversation.messages.filter(msg => msg.type === 'note');

    const formatTimestamp = (timestamp: any): Date | null => {
        if (!timestamp) return null;
        if (timestamp instanceof Date) return timestamp;
        if (typeof timestamp.toDate === 'function') return timestamp.toDate();
        try {
            return toDate(timestamp);
        } catch (error) {
            return null;
        }
    }

    return (
        <aside className="w-96 bg-background border-l flex flex-col h-full">
            <header className="p-4 border-b flex items-center justify-between h-16">
                <h3 className="font-semibold text-lg">Ficha do Cliente</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-4 h-4" />
                </Button>
            </header>
            <ScrollArea className="flex-1">
                <div className="p-4">
                    <div className="text-center mb-6">
                        <Avatar className="w-20 h-20 border-2 border-primary mx-auto mb-2">
                            <AvatarImage src={conversation.clientAvatarUrl} alt={conversation.clientName} />
                            <AvatarFallback>{conversation.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold">{conversation.clientName}</h2>
                            <p className="text-sm text-muted-foreground">
                                ID: {conversation.clientId}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Responsible Agent */}
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <UserIcon className="w-4 h-4" />
                                    Responsável
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage src={agent?.avatarUrl} alt={agent?.name} />
                                        <AvatarFallback>{agent?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-sm">{agent?.name}</p>
                                        <p className="text-xs text-muted-foreground">{agent?.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card>
                             <CardHeader className="p-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Tag className="w-4 h-4" />
                                    Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex flex-wrap gap-1">
                                    {conversation.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <button className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
                                        </Badge>
                                    ))}
                                        <Button variant="ghost" size="sm" className="gap-1 text-primary h-6 text-xs px-2">
                                        <PlusCircle className="w-3 h-3" />
                                        Adicionar Tag
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                            {/* Custom Fields */}
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Building className="w-4 h-4" />
                                    Campos Personalizados
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                    <div className="text-center text-muted-foreground py-4 text-xs">
                                    <p>Nenhum campo personalizado definido.</p>
                                    <p className="text-xs">(Em breve, o gestor poderá adicionar campos aqui)</p>
                                </div>
                            </CardContent>
                        </Card>


                        {/* Internal Notes */}
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <StickyNote className="w-4 h-4" />
                                    Notas Internas
                                </CardTitle>
                            </CardHeader>
                             <CardContent className="p-4 pt-0">
                                {internalNotes.length > 0 ? (
                                    <div className="space-y-3 max-h-48 overflow-y-auto">
                                        {internalNotes.map(note => {
                                            const formattedDate = formatTimestamp(note.timestamp);
                                            return (
                                            <div key={note.id} className="text-xs p-2 bg-muted/50 rounded-md">
                                                    <p className="whitespace-pre-wrap break-words">{note.content}</p>
                                                    {formattedDate && (
                                                        <p className="text-xs text-muted-foreground mt-1 text-right">
                                                        {format(formattedDate, 'dd/MM/yy HH:mm')}
                                                        </p>
                                                    )}
                                            </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-4 text-xs">
                                    <p>Nenhuma nota interna para esta conversa.</p>
                                </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
