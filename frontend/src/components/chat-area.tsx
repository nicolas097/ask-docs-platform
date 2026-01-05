import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatArea() {
  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="p-4 border-b flex justify-between items-center bg-background/95 backdrop-blur">
        <div>
          <h2 className="font-semibold text-sm md:text-base">Asistente IA</h2>
          <p className="text-xs text-muted-foreground">En línea</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-tl-none p-3 max-w-[85%] text-sm shadow-sm">
              <p>Hola 👋 He analizado tu documento PDF. Parece contener información legal importante. ¿En qué puedo ayudarte?</p>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 max-w-[85%] text-sm shadow-sm">
              <p>¿Cuáles son los puntos clave de la página 1?</p>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <form className="flex gap-2 relative">
          <Input 
            placeholder="Pregunta sobre el documento..." 
            className="pr-12 py-6 rounded-full border-muted-foreground/20 focus-visible:ring-offset-0 focus-visible:ring-1" 
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1 top-1 h-10 w-10 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}