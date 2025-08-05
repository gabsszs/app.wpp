import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Bem-vindo ao ConectaZap</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sua plataforma de chat está quase pronta.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/auth/login" passHref>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
              Ir para o Login
            </button>
          </Link>
          <Link href="/chat" passHref>
             <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
              Ir para o Chat
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
