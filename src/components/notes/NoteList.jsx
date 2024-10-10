import React, { useState, useRef, useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const NoteList = ({ notes }) => {
  const isArabic = (text) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  };

  return (
    <div className="flex flex-col space-y-4">
      <ScrollArea className="h-[300px] w-full rounded-md border border-border p-4">
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id}>
              <Link href={`/notes/${note.id}`}>
                <div className="flex flex-row-reverse justify-between items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          className={`w-full truncate text-right ${
                            isArabic(note.title)
                              ? "justify-end"
                              : "justify-start"
                          }`}
                          // onClick={() => handleNoteClick(note.id)}
                        >
                          <span className="truncate">{note.title}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{note.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default NoteList;
