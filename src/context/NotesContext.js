"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

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
    default:
      return state;
  }
};

export const NotesProvider = ({ children }) => {
  const [notes, dispatch] = useReducer(notesReducer, []);
  const { user } = useAuth();

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

  return (
    <NotesContext.Provider
      value={{ notes, addNote, updateNote, deleteNote, fetchNotes }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
