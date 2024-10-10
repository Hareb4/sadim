"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusIcon,
  ChevronRightIcon,
  DashboardIcon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { useAuth } from "@/components/providers/AuthProvider";
import { useNotes } from "@/context/NotesContext";
import NoteList from "@/components/notes/NoteList";
import UserMenu from "@/components/customeui/UserMenu";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export default function Sidebar() {
  const router = useRouter();

  // const { user } = useAuth();
  const user = supabase.auth.getUser();
  const { addNote, notes, isLoading } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleCreateNewNote = async () => {
    if (isCreating) return;
    setIsCreating(true);

    try {
      const { data, error } = await addNote({
        user_id: user.id,
      });

      if (error) throw error;

      router.push(`/notes/${data.id}`);
      setIsSidebarVisible(false);
    } catch (error) {
      console.error("Error creating new note:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleNavigateToHome = () => {
    router.push("/notes");
    setIsSidebarVisible(false);
  };

  const filteredNotes = useMemo(() => {
    if (!notes) return [];

    if (searchTerm.startsWith("#")) {
      // Search in tags only
      const tagSearch = searchTerm.slice(1).toLowerCase();
      return notes.filter((note) =>
        note.tags?.some((tag) => tag.name.toLowerCase().includes(tagSearch))
      );
    } else {
      // Search in titles and tags
      return notes.filter(
        (note) =>
          note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.tags?.some((tag) =>
            tag.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
  }, [searchTerm, notes]);

  return (
    <>
      <div
        className={`${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 fixed sm:relative sm:w-72 h-dvh bg-white dark:bg-[#121212] z-30 flex flex-col p-4 transition-transform duration-300 ease-in-out`}
        dir="rtl"
      >
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 left-2 sm:hidden"
          onClick={toggleSidebar}
        >
          <ChevronRightIcon />
        </Button>

        <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
          سديم
        </h1>

        <Button
          asChild
          variant="ghost"
          className="mb-4 w-full justify-start text-black dark:text-white"
          onClick={handleNavigateToHome}
        >
          <Link href="/notes" className="flex items-center">
            <DashboardIcon className="ml-2 h-4 w-4 text-black dark:text-white" />
            <span>الرئيسية</span>
          </Link>
        </Button>

        <Button
          onClick={handleCreateNewNote}
          className="mb-4 w-full justify-start"
        >
          <PlusIcon className="ml-2 h-4 w-4 " />
          <span>ملاحظة جديدة</span>
        </Button>

        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="بحث في الملاحظات"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : (
            <NoteList notes={filteredNotes} />
          )}
        </div>

        <UserMenu />
      </div>

      <div className="sticky top-0 sm:hidden z-20 w-full h-16 flex items-center px-4">
        <Button
          className="w-full flex items-center justify-between"
          onClick={toggleSidebar}
        >
          <HamburgerMenuIcon className="h-6 w-6" />
          <span className="ml-2">سديم</span>
        </Button>
      </div>

      {isSidebarVisible && (
        <div
          className="fixed inset-0 z-10 bg-black/50"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
