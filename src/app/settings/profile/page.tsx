
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil da Empresa</CardTitle>
        <CardDescription>
          Atualize as informações da sua empresa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Nome da Empresa</Label>
          <Input id="company-name" placeholder="Nome da sua empresa" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-bio">Biografia</Label>
          <Textarea id="company-bio" placeholder="Descreva brevemente sua empresa" />
        </div>
         <div className="space-y-2">
          <Label htmlFor="company-logo">Logo da Empresa</Label>
          <Input id="company-logo" type="file" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Salvar Alterações</Button>
      </CardFooter>
    </Card>
  );
}
