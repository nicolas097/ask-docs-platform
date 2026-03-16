import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      
      {/* Icono gigante para dar contexto visual */}
      <div className="bg-muted p-6 rounded-full mb-6">
        <FileQuestion className="w-16 h-16 text-muted-foreground" />
      </div>
      
      {/* Títulos claros */}
      <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">
        Página no encontrada
      </h2>
      
      {/* Mensaje de ayuda */}
      <p className="text-muted-foreground mb-8 max-w-md">
        Lo sentimos, la ruta a la que intentas acceder no existe. Es posible que hayas escrito mal la dirección o que el documento haya sido eliminado.
      </p>
      
      {/* Botón para volver a la zona segura (usando el asChild que aprendimos) */}
      <Button asChild size="lg">
        <Link href="/">
          Volver al inicio
        </Link>
      </Button>
      
    </div>
  );
}