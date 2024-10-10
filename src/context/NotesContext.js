"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from "react";
// import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

const NotesContext = createContext();

const notesReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTES":
      return action.payload;
    case "ADD_NOTE":
      return [action.payload, ...state];
    case "UPDATE_NOTE":
      return state.map((note) =>
        note.id === action.payload.id ? action.payload : note
      );
    case "DELETE_NOTE":
      return state.filter((note) => note.id !== action.payload);
    // case "SET_TAGS":
    //   return action.payload;
    // case "ADD_TAG":
    //   return [action.payload, ...state];
    // case "DELETE_TAG":
    //   return state.filter((note) => note.id !== action.payload);
    default:
      return state;
  }
};

export const NotesProvider = ({ children }) => {
  const [notes, dispatch] = useReducer(notesReducer, []);
  // const { user } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.log("no user");
      } else {
        console.log("o user");
        setUser(data.user);
      }
    }
    getUser();
  }, []);

  // console.log({ user });

  // useEffect(() => {
  //   if (user) {
  //     fetchNotes();
  //   }
  // }, [user]);

  // Memoize the fetchNotes function so it's not recreated on every render
  const fetchNotes = useCallback(async () => {
    if (!user) return; // Ensure user exists before fetching notes

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error.message);
    } else {
      dispatch({ type: "SET_NOTES", payload: data });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotes(); // Fetch notes when the user is authenticated
    }
  }, [user, fetchNotes]);

  const addNote = async (newNote) => {
    const { data, error } = await supabase
      .from("notes")
      .insert([newNote])
      .select()
      .single();

    if (error) {
      console.error("Error adding note:", error.message);
    } else {
      dispatch({ type: "ADD_NOTE", payload: data });
      fetchNotes(); // Refresh notes after adding
    }

    return { data, error };
  };

  const updateNote = async (updatedNote) => {
    const { data, error } = await supabase
      .from("notes")
      .update(updatedNote)
      .eq("id", updatedNote.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating note:", error.message);
    } else {
      dispatch({ type: "UPDATE_NOTE", payload: data });
      fetchNotes(); // Refresh notes after updating
    }

    return { data, error };
  };

  const deleteNote = async (id) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      console.error("Error deleting note:", error.message);
    } else {
      dispatch({ type: "DELETE_NOTE", payload: id });
      fetchNotes(); // Refresh notes after deleting
    }

    return { error };
  };

  // const fetchTags = async () => {
  //   const { data, error } = await supabase
  //     .from("note_tags")
  //     .select("tags(*)")
  //     .eq("note_id", noteId);

  //   if (error) {
  //     console.error("Error fetching tags:", error);
  //   } else {
  //     setTags(data.map((item) => item.tags));
  //   }
  // };

  // const addTag = async () => {
  //   if (!newTag.trim() || !noteId) return;

  //   const { data: existingTag, error: fetchError } = await supabase
  //     .from("tags")
  //     .select("id")
  //     .eq("name", newTag.trim())
  //     .single();

  //   let tagId;

  //   if (fetchError) {
  //     const { data: newTagData, error: insertError } = await supabase
  //       .from("tags")
  //       .insert({ name: newTag.trim() })
  //       .select()
  //       .single();

  //     if (insertError) {
  //       console.error("Error creating new tag:", insertError);
  //       toast({
  //         title: "Error",
  //         status: "error",
  //       });
  //       return;
  //     }

  //     tagId = newTagData.id;
  //   } else {
  //     tagId = existingTag.id;
  //   }

  //   const { error: linkError } = await supabase
  //     .from("note_tags")
  //     .insert({ note_id: noteId, tag_id: tagId, user_id: user.id });

  //   if (linkError) {
  //     console.error("Error linking tag to note:", linkError);
  //     toast({
  //       title: "Error",
  //       status: "error",
  //     });
  //   } else {
  //     fetchTags();
  //     setNewTag("");
  //   }
  // };

  // const removeTag = async (tagId) => {
  //   console.log("remove tag: ", tagId);
  //   const { error } = await supabase
  //     .from("note_tags")
  //     .delete()
  //     .eq("note_id", noteId)
  //     .eq("tag_id", tagId)
  //     .eq("user_id", user.id);

  //   if (error) {
  //     console.error("Error removing tag:", error);
  //     toast({
  //       title: "Error",
  //       description: "An error occurred while removing the tag.",
  //       status: "error",
  //     });
  //   } else {
  //     fetchTags();
  //     toast({
  //       title: "Tag Deleted",
  //       description: "The tag has been successfully deleted.",
  //       status: "success",
  //     });
  //   }
  // };

  return (
    <NotesContext.Provider
      value={{ notes, addNote, updateNote, deleteNote, fetchNotes }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
