
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function TeamsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipes</CardTitle>
        <CardDescription>
          Gerencie suas equipes e departamentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">Nenhuma equipe criada ainda.</p>
        </div>
      </CardContent>
       <CardFooter>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Equipe
        </Button>
      </CardFooter>
    </Card>
  );
}
