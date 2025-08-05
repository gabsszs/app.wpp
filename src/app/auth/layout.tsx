import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/3 2xl:w-3/4 items-center justify-center p-12 bg-primary/10 relative">
        <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold tracking-tighter text-primary">ConectaZap</h1>
            <p className="mt-4 text-lg text-foreground/80">
            A plataforma completa para centralizar e otimizar seu atendimento via WhatsApp.
            </p>
        </div>
        <div className="absolute bottom-6 right-6 text-sm text-foreground/60">
            &copy; {new Date().getFullYear()} ConectaZap. Todos os direitos reservados.
        </div>
      </div>
      <div className="w-full lg:w-1/2 xl:w-1/3 2xl:w-1/4 bg-background flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
