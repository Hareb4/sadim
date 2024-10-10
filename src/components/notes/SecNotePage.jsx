"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import TagManager from "@/components/customeui/TagManager";
import TextareaAutosize from "react-textarea-autosize";
import BlockNoteEditor from "./Editor";
import { useDebounce } from "@/hooks/useDebounce";
import Cover from "./Cover";
import NoteSkeleton from "../customeui/NoteSkeleton";

export default function SecNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  // Debounce values to avoid unnecessary frequent updates
  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 500);

  // Fetch the note on component mount
  useEffect(() => {
    const fetchNote = async () => {
      if (!id || id === "new") {
        setNote({ title: "", content: "", html_content: "" });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("notes")
        .select(
          `
          *,
          tags:note_tags(
            tag:tags(*)
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching note:", error);
        router.push("/notes");
      } else {
        setNote(data);
        setTitle(data.title);
        setContent(data.content);

        setCoverUrl(data.cover_url || "");
      }
      setIsLoading(false);
    };

    fetchNote();
  }, [id, router]);

  // Update the note in the database
  const updateNote = useCallback(
    async (updates) => {
      if (!note || !user) return;

      const { data, error } = await supabase
        .from("notes")
        .upsert({ id: note.id, user_id: user.id, ...updates })
        .select()
        .single();

      if (error) {
        console.error("Error saving note:", error);
      } else {
        setNote(data);
        if (id === "new") {
          router.replace(`/notes/${data.id}`);
        }
      }
    },
    [note, user, id, router]
  );

  // Debounced effect to update the note's title
  useEffect(() => {
    if (debouncedTitle && debouncedTitle !== note?.title) {
      updateNote({ title: debouncedTitle });
    }
  }, [debouncedTitle, note?.title, updateNote]);

  // Debounced effect to update the note's content
  useEffect(() => {
    if (debouncedContent && debouncedContent !== note?.content) {
      updateNote({ content: debouncedContent });
    }
  }, [debouncedContent, note?.content, updateNote]);

  // Debounced effect to update the note's HTML content

  // Show loading state if note is still being fetched
  if (isLoading) {
    return <NoteSkeleton />;
  }

  // Enable cover image
  const enableCover = async () => {
    const randomImg = await fetch("https://picsum.photos/1200/800");
    setCoverUrl(randomImg.url);
    updateNote({ cover_url: randomImg.url });
  };

  return (
    <div
      className="h-full overflow-y-auto overflow-x-hidden hide-scrollbar dark:bg-[#1F1F1F]"
      dir="rtl"
    >
      <div className="flex flex-col w-full">
        <Cover url={coverUrl} setUrl={setCoverUrl} />
        <div className="px-5 pb-20">
          <div className="group flex flex-col gap-2 pt-10">
            {!coverUrl && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  variant="outline"
                  className="text-neutral-400"
                  onClick={enableCover}
                >
                  أضف خلفية 🌆
                </button>
              </div>
            )}
            <TextareaAutosize
              placeholder="عنوان"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              dir="rtl"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none py-4"
            />
          </div>
          <TagManager noteId={id !== "new" ? id : null} />
          <div className="relative">
            <BlockNoteEditor
              initialContent={content}
              onChange={(content) => setContent(content)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
