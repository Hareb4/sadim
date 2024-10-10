"use client";

import React, { useEffect } from "react";
import { Card } from "../customeui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { useNotes } from "@/context/NotesContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function NotesGrid() {
  // const { user } = useAuth();
  
  const user = supabase.auth.getUser();
  const { notes, fetchNotes } = useNotes();

  // Fetch notes when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchNotes(); // Ensures that notes are fetched when user logs in or page reloads
    }
  }, [user, fetchNotes]);

  return (
    <div className="py-4">
      {/* Notes Grid/List */}
      <AnimatePresence>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {notes && notes.length > 0 ? (
            notes.map((note) => (
              <motion.div
                key={note.id}
                transition={{
                  duration: 0.5, // Smooth transition
                  ease: "easeInOut",
                }}
                className="transition-transform" // Subtle hover effect
              >
                <Card
                  note={note}
                  // style={{ backgroundColor: note.color }}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center">ليس لديك أي ملاحظات</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
