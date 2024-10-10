"use client";

import React, { useState, useEffect } from "react";
// import { Card } from "../customeui/Card";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useNotes } from "@/context/NotesContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Share2Icon, TrashIcon, GridIcon, ListIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const colorOptions = [
  { value: "#ffffff", label: "White" },
  { value: "#ffcccb", label: "Light Pink" },
  { value: "#90ee90", label: "Light Green" },
  { value: "#add8e6", label: "Light Blue" },
];

export default function NoteGrid() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  // const { user } = useAuth();
  const user = supabase.auth.getUser();

  const { notes, deleteNote, updateNote, fetchNotes } = useNotes();
  const { theme } = useTheme();
  const router = useRouter();

  // Fetch notes when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchNotes(); // Ensures that notes are fetched when user logs in or page reloads
    }
  }, [user, fetchNotes]);

  const handleDeleteClick = (id) => {
    setSelectedNoteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await deleteNote(selectedNoteId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  };

  const handleShareClick = (id) => {
    console.log("Share note:", id);
    // Implement share functionality
  };

  const handleColorChange = async (e, note, color) => {
    e.preventDefault();
    const updatedNote = { ...note, color: color };
    try {
      await updateNote(updatedNote);
    } catch (error) {
      console.error("Error updating note color:", error.message);
    }
  };

  const isArabic = (text) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  };

  function darkenHexColor(hex, amount) {
    // Remove the '#' if present
    hex = hex?.replace(/^#/, "");

    // Parse the r, g, b values
    let r = parseInt(hex?.substring(0, 2), 16);
    let g = parseInt(hex?.substring(2, 4), 16);
    let b = parseInt(hex?.substring(4, 6), 16);

    // Decrease the r, g, b values by the amount
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    // Convert back to hex and ensure 2 digits
    const newHex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)}`;

    return newHex;
  }

  return (
    <div
      className="space-y-6 p-6 min-h-screen transition-colors duration-300"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p>مرحبا, {user.user_metadata.display_name}</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            ملاحظاتك
          </h1>
        </div>
        <Select value={viewMode} onValueChange={(value) => setViewMode(value)}>
          <SelectTrigger className="w-[180px] bg-gray-100 dark:bg-zinc-800 shadow-sm rounded-md transition-colors">
            <SelectValue placeholder="عرض الملاحظات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">
              <div className="flex flex-row-reverse items-center justify-end">
                <GridIcon className="ml-2 h-4 w-4 text-gray-700 dark:text-gray-300" />
                عرض الشبكة
              </div>
            </SelectItem>
            <SelectItem value="list">
              <div className="flex flex-row-reverse items-center justify-end">
                <ListIcon className="ml-2 h-4 w-4 text-gray-700 dark:text-gray-300" />
                عرض القائمة
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes Grid/List */}
      <AnimatePresence>
        <motion.div
          className={`${
            viewMode === "grid"
              ? "columns-1 md:columns-2 lg:columns-3 gap-4 p-4 sm:p-1 mt-2 "
              : "columns-1"
          }`}
        >
          {notes != "" ? (
            notes.map((note) => (
              <motion.div
                key={note.id}
                transition={{
                  duration: 0.5, // Increased for smoothness
                  ease: "easeInOut", // Smoother easing
                }}
                className="transition-transform" // Subtle hover effect
              >
                <Card
                  className={`overflow-hidden transition-shadow duration-200 hover:shadow-lg rounded-lg mb-6`}
                  // style={{ backgroundColor: note.color }}
                >
                  <Link href={`/notes/${note.id}`} passHref prefetch>
                    <CardContent
                      className={`p-4 cursor-pointer `}
                      // style={{
                      //   backgroundColor:
                      //     theme === "dark"
                      //       ? darkenHexColor(note.color, 150)
                      //       : note.color,
                      // }}
                    >
                      <h2
                        className={`font-semibold text-lg mb-2 ${
                          isArabic(note.title) ? "text-right" : "text-left"
                        }`}
                      >
                        {note.title}
                      </h2>
                      {/* <p
                      className={`text-sm text-gray-700 dark:text-gray-300 line-clamp-3 ${
                        isArabic(note.content) ? "text-right" : "text-left"
                      }`}
                    >
                      {note.content}
                    </p> */}
                    </CardContent>
                  </Link>

                  {/* Footer */}
                  <CardFooter
                    className="flex justify-between items-center p-2"
                    // style={{
                    //   backgroundColor:
                    //     theme === "dark"
                    //       ? darkenHexColor(note.color, 150)
                    //       : note.color,
                    // }}
                  >
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteClick(note.id);
                              }}
                              aria-label="حذف الملاحظة"
                            >
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>حذف الملاحظة</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className={"hidden"}
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                handleShareClick(note.id);
                              }}
                              aria-label="مشاركة الملاحظة"
                            >
                              <Share2Icon className="h-4 w-4 text-indigo-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>مشاركة الملاحظة</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* <div className="flex gap-1">
                    {colorOptions.map((color) => (
                      <TooltipProvider key={color.value}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex justify-center items-center text-black ${
                                note.color === color.value
                                  ? theme === "dark"
                                    ? "border-white"
                                    : "border-gray-900"
                                  : "border-transparent"
                              }`}
                              style={{
                                backgroundColor:
                                  theme === "dark"
                                    ? darkenHexColor(color.value, 150)
                                    : color.value,
                              }}
                              onClick={(e) =>
                                handleColorChange(e, note, color.value)
                              }
                              aria-label={color.label}
                            >
                              {note.color === color.value ? (
                                <CheckIcon
                                  className={`${
                                    theme === "dark" ? "text-white" : ""
                                  }`}
                                />
                              ) : (
                                ""
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{color.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div> */}
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div>ليس لديك أي ملاحظات</div>
          )}
          {}
        </motion.div>
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          >
            <h2
              className="text-xl font-bold text-red-700 dark:text-red-300 mb-4"
              dir="rtl"
            >
              هل أنت متأكد من حذف هذه الملاحظة؟
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              هذا الإجراء لا يمكن إلغاؤه. سيتم حذف الملاحظة نهائياً وإزالة
              بياناتها من خوادمنا.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="dark:bg-zinc-700 dark:text-white"
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirmation}
                className="dark:bg-red-700 dark:hover:bg-red-600"
              >
                حذف
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
