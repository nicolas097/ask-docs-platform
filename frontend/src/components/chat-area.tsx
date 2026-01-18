'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from './ui/spinner';
import { Button } from './ui/button';
import { Icon, Send, CirclePause } from 'lucide-react';



export function ChatArea() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, stop } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (

    <div className="flex flex-col w-full h-[81vh] bg-background overflow-hidden relative">


      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 pt-20">

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>

              <span className="text-[10px] font-bold uppercase tracking-widest mb-1 px-1 text-slate-400 opacity-80">
                {message.role === 'user' ? 'Tú' : 'Gemini'}
              </span>

              <div
                className={`px-4 py-2 shadow-sm text-sm whitespace-pre-wrap ${message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                  : 'bg-slate-200 text-slate-800 rounded-2xl rounded-tl-none'
                  }`}
              >
                {message.parts.map((part, i) => (
                  part.type === 'text' && <div key={i}>{part.text}</div>
                ))}



              </div>


            </div>

            <div ref={scrollRef} />
          </div>
        ))}
        {(status === 'submitted' || status === 'streaming') && (
          <div>
            {status === 'submitted' && <Spinner />}
            <Button type="button" onClick={() => stop()} className='bg-blue-400'>
              <CirclePause className='' />
            </Button>
          </div>
        )}

      </div>

      <div className="p-4 bg-background border-t">
        <form
          className="relative flex items-center max-w-2xl mx-auto w-full"
          onSubmit={e => {
            e.preventDefault();
            if (input.trim() && status === 'ready') {
              sendMessage({ text: input });
              setInput('');
            }
          }}
        >
          <Input
            className="pr-12 shadow-sm rounded-xl bg-slate-50"
            value={input}
            disabled={status !== 'ready'}
            placeholder="Escribe un mensaje..."
            onChange={e => setInput(e.currentTarget.value)}
          />

          <Button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            size="icon"
            variant="ghost"
            className="absolute right-1 h-8 w-8 text-blue-600"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );

}