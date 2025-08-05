
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import type { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const contacts = users.filter(user => user.role === 'client');

  const filteredAndGroupedContacts = useMemo(() => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filtered.reduce((acc, contact) => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(contact);
      return acc;
    }, {} as Record<string, User[]>);

    return Object.keys(grouped).sort().reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
    }, {} as Record<string, User[]>);

  }, [contacts, searchTerm]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Contatos</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Contato
        </Button>
      </div>
      <Card className="shadow-lg flex-1 flex flex-col min-h-0">
        <CardHeader>
           <div className="relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
                placeholder="Buscar contatos..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </CardHeader>
        <CardContent className="flex-1 flex min-h-0">
            <div className="flex-grow w-full h-full flex">
                <ScrollArea className="flex-1 pr-6">
                    {Object.keys(filteredAndGroupedContacts).length > 0 ? (
                        Object.entries(filteredAndGroupedContacts).map(([letter, contacts]) => (
                            <div key={letter} id={`letter-${letter}`} className="mb-4">
                                <h2 className="text-lg font-bold text-primary pl-2 pb-2 border-b mb-2">{letter}</h2>
                                <div className="space-y-1">
                                    {contacts.map(contact => (
                                        <div key={contact.id} className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
                                            <Avatar className="w-10 h-10 mr-4">
                                                <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                                                <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-base">{contact.name}</p>
                                                <p className="text-sm text-muted-foreground">{contact.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">Nenhum contato encontrado.</p>
                        </div>
                    )}
                </ScrollArea>
                <div className="flex flex-col items-center justify-center space-y-1 pl-4">
                    {alphabet.map(letter => (
                        <a 
                            key={letter} 
                            href={`#letter-${letter}`} 
                            className="text-xs font-bold text-primary hover:underline"
                        >
                            {letter}
                        </a>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
