"use client";

import { useTitle } from "@/context/TitleDocuments";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Si usas shadcn
import { PlusCircle, CircleArrowUpIcon } from "lucide-react"; // Si usas iconos

export function NewChatButton() {
    const { setTitle } = useTitle();

    const handleNewChat = () => {

        setTitle("Nueva Conversación");
    }

    return (
        <>
            <Link href={"/workspace"} onClick={handleNewChat} className="w-full">
                <Button

                    className="w-full justify-center gap-2" variant="outline"


                >

                    <CircleArrowUpIcon className="mr-2 h-4 w-4 text-black" />
                    <span className="text-gray-950">Nuevo PDF</span>
                </Button>
            </Link>
        </>


    );
}