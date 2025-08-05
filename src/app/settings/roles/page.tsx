
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function RolesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funções e Permissões</CardTitle>
        <CardDescription>
          Crie e gerencie as funções de acesso para seus usuários.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">Nenhuma função personalizada criada.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Função
        </Button>
      </CardFooter>
    </Card>
  );
}
