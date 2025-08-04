
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ContactsPage() {
  const contacts = users.filter(user => user.role === 'client');

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Contatos</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Contato
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Sua Lista de Contatos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contacts.map(contact => (
              <Card key={contact.id} className="p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                  <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-lg">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
