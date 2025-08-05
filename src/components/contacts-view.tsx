
'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export function ContactsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLetter, setActiveLetter] = useState('A');
  const contacts = users.filter(user => user.role === 'client');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Record<string, HTMLDivElement>>({});

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
  
  const handleScroll = useCallback(() => {
    const scrollContainer = scrollAreaRef.current?.children[0] as HTMLDivElement;
    if (!scrollContainer) return;
    
    const { scrollTop } = scrollContainer;
    let currentLetter = '';

    for (const letter of Object.keys(letterRefs.current)) {
      const el = letterRefs.current[letter];
      if (el && el.offsetTop - 80 <= scrollTop) { // offset to improve accuracy
        currentLetter = letter;
      }
    }

    if (currentLetter && currentLetter !== activeLetter) {
      setActiveLetter(currentLetter);
    }
  }, [activeLetter]);

  const handleLetterClick = (letter: string) => {
      const el = letterRefs.current[letter];
      const scrollContainer = scrollAreaRef.current?.children[0] as HTMLDivElement;
      if (el && scrollContainer) {
          scrollContainer.scrollTo({
              top: el.offsetTop - 10,
              behavior: 'smooth'
          });
          setActiveLetter(letter);
      }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pb-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                placeholder="Buscar contatos..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <div className="flex-1 flex min-h-0 px-6 pb-6">
            <div className="flex-grow w-full h-full flex">
                <ScrollArea className="flex-1 pr-6 -mr-2" ref={scrollAreaRef} onScroll={handleScroll}>
                    {Object.keys(filteredAndGroupedContacts).length > 0 ? (
                        Object.entries(filteredAndGroupedContacts).map(([letter, contacts]) => (
                            <div key={letter} ref={ref => {if(ref) letterRefs.current[letter] = ref}} className="mb-4">
                                <h2 className="text-xl font-bold text-primary pl-2 pb-2 border-b mb-2">{letter}</h2>
                                <div className="space-y-1">
                                    {contacts.map(contact => (
                                        <div key={contact.id} className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors duration-200 cursor-pointer">
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
                <div className="flex flex-col items-center justify-between pl-4">
                    {alphabet.map(letter => (
                        <button
                            key={letter} 
                            onClick={() => handleLetterClick(letter)} 
                            className={cn(
                                "text-xs font-bold text-muted-foreground hover:text-primary transition-all",
                                activeLetter === letter && "text-primary scale-125"
                            )}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
