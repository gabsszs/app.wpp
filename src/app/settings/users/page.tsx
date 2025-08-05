
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, User as UserIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";


// Mock data - replace with actual data from your backend
const teamMembers = [
  {
    id: 'user-agent-1',
    name: 'Carlos Oliveira',
    email: 'agent1@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'Agent',
    status: 'Active',
  },
  {
    id: 'user-agent-2',
    name: 'Sofia Rodrigues',
    email: 'agent2@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'Agent',
    status: 'Invited',
  },
  {
    id: 'user-admin-1',
    name: 'Lucas Martins',
    email: 'admin@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'Admin',
    status: 'Active',
  },
];


export default function UsersPage() {
  const [isInviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleInvite = (event: React.FormEvent) => {
    event.preventDefault();
    // Logic to send invitation would go here
    
    // For now, just show a success toast and close the dialog
    toast({
      title: "Convite Enviado!",
      description: "O convite foi enviado para o e-mail do novo membro.",
    });
    setInviteDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>
            Gerencie os membros da sua equipe, incluindo agentes e supervisores.
            </CardDescription>
        </div>
         <Dialog open={isInviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Convidar Usuário
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Convidar Novo Usuário</DialogTitle>
                <DialogDescription>
                    Envie um convite para um novo membro se juntar à sua equipe.
                </DialogDescription>
                </DialogHeader>
                <form id="invite-form" onSubmit={handleInvite}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nome@empresa.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="role">Função</Label>
                             <Select required>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Selecione uma função" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="agent">Agente</SelectItem>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                    <SelectItem value="supervisor">Supervisor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button type="submit" form="invite-form">Enviar Convite</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
               <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>{member.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      <p>{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                    {member.status === 'Active' ? 'Ativo' : 'Convidado'}
                  </Badge>
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Reenviar Convite</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Desativar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {teamMembers.length === 0 && (
            <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
                <p className="text-muted-foreground">Nenhum usuário adicionado ainda.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
