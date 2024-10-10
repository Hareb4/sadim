"use client";

import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import TextareaAutosize from "react-textarea-autosize";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../providers/AuthProvider";
// import { useNotes } from "@/context/NotesContext";

const supabase = createClient();

export default function TagManager({ noteId }) {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();
  // const { user } = useAuth();
  const user = supabase.auth.getUser();

  // const { fetchTags, addTag, removeTag } = useNotes();

  useEffect(() => {
    if (noteId) {
      fetchTags();
    }
  }, [noteId]);

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from("note_tags")
      .select("tags(*)")
      .eq("note_id", noteId);

    if (error) {
      console.error("Error fetching tags:", error);
    } else {
      setTags(data.map((item) => item.tags));
    }
  };

  const addTag = async () => {
    if (!newTag.trim() || !noteId) return;

    const { data: existingTag, error: fetchError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", newTag.trim())
      .single();

    let tagId;

    if (fetchError) {
      const { data: newTagData, error: insertError } = await supabase
        .from("tags")
        .insert({ name: newTag.trim() })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating new tag:", insertError);
        toast({
          title: "Error",
          status: "error",
        });
        return;
      }

      tagId = newTagData.id;
    } else {
      tagId = existingTag.id;
    }

    const { error: linkError } = await supabase
      .from("note_tags")
      .insert({ note_id: noteId, tag_id: tagId, user_id: user.id });

    if (linkError) {
      console.error("Error linking tag to note:", linkError);
      toast({
        title: "Error",
        status: "error",
      });
    } else {
      fetchTags();
      setNewTag("");
    }
  };

  const removeTag = async (tagId) => {
    console.log("remove tag: ", tagId);
    const { error } = await supabase
      .from("note_tags")
      .delete()
      .eq("note_id", noteId)
      .eq("tag_id", tagId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error removing tag:", error);
      toast({
        title: "Error",
        description: "An error occurred while removing the tag.",
        status: "error",
      });
    } else {
      fetchTags();
      toast({
        title: "Tag Deleted",
        description: "The tag has been successfully deleted.",
        status: "success",
      });
    }
  };

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="flex items-center">
            {tag.name}
            <Button
              size="sm"
              variant="ghost"
              className="ml-1 h-4 w-4 p-0"
              onClick={() => removeTag(tag.id)}
            >
              <Cross2Icon className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex">
        <TextareaAutosize
          placeholder="وسم"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            console.log(e.target.value.slice(-1) === " ");
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent newline insertion
            }
            if (
              e.key === " " ||
              e.key === "Spacebar" ||
              e.code === "Space" ||
              e.target.value.slice(-1) === " "
            ) {
              console.log("you clicked space");
              e.preventDefault();
              addTag();
            }
          }}
          dir="rtl"
          className="max-h-7 w-full resize-none appearance-none overflow-hidden bg-transparent focus:outline-none my-0"
        />
        {/* <Input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="أضف وسمًا جديدًا"
          className="ml-2 w-full resize-none appearance-none overflow-hidden bg-transparent border-none shadow-none focus:outline-none active:outline-none"
        />
        <Button onClick={addTag}>
          <PlusIcon className="ml-2 h-4 w-4" />
          إضافة
        </Button> */}
      </div>
    </div>
  );
}
