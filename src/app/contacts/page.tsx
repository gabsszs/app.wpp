
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/mock-data';

export default function ContactsPage() {
  const contacts = users.filter(user => user.role === 'client');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contatos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Sua Lista de Contatos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.map(contact => (
              <div key={contact.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                <Avatar>
                  <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
