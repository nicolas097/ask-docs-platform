"use client";

import { useEffect } from "react";
import { useTitle } from "@/context/TitleDocuments";

export function TitleUpdater({ title }: { title: string }) {
  const { setTitle } = useTitle();

  useEffect(() => {
    if (title) {
      setTitle(title);
    }
  }, [title, setTitle]);

  return null; 
}