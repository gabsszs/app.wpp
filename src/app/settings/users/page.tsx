
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function UsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários</CardTitle>
        <CardDescription>
          Gerencie os membros da sua equipe, incluindo agentes e supervisores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">Nenhum usuário adicionado ainda.</p>
        </div>
      </CardContent>
       <CardFooter>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Convidar Usuário
        </Button>
      </CardFooter>
    </Card>
  );
}
