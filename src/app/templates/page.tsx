
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Mock data for templates
const templates = [
  {
    id: 'template-1',
    title: 'Saudação Inicial',
    content: 'Olá! Bem-vindo ao nosso serviço. Como podemos ajudar você hoje?',
  },
  {
    id: 'template-2',
    title: 'Agradecimento',
    content: 'Obrigado por entrar em contato! Se precisar de mais alguma coisa, estamos à disposição.',
  },
  {
    id: 'template-3',
    title: 'Acompanhamento',
    content: 'Olá! Só para confirmar, sua solicitação foi resolvida? Por favor, nos avise se precisar de mais ajuda.',
  },
];

export default function TemplatesPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Templates de Mensagens</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Novo Template
        </Button>
      </div>
      <div className="grid gap-6">
        {templates.map(template => (
          <Card key={template.id} className="shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader>
              <CardTitle>{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{template.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        {templates.length === 0 && (
           <Card className="flex flex-col items-center justify-center p-12 border-dashed">
            <CardHeader>
              <CardTitle>Nenhum Template Encontrado</CardTitle>
              <CardDescription>Comece criando seu primeiro template de mensagem.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Novo Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
