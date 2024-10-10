"use client";
import { useNotes } from "@/context/NotesContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Card = ({ note }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const { deleteNote } = useNotes();

  const handleDeleteClick = () => {
    setSelectedNoteId(note.id);
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

  return (
    <>
      <div class="rounded shadow-lg dark:bg-[#212023]">
        <Link href={`/notes/${note.id}`} passHref prefetch>
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">{note.title}</div>
          </div>
        </Link>
        <div class="px-6 pt-4 pb-2">
          <span
            onClick={handleDeleteClick}
            class="inline-block bg-red-200 rounded-full px-3 py-1 text-sm font-semibold text-red-700 mb-2 hover:cursor-pointer"
          >
            حذف
          </span>
        </div>
      </div>
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
    </>
  );
};
