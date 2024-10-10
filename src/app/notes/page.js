import { IBM_Plex_Sans_Arabic } from "next/font/google";
import NotesGrid from "@/components/notes/NotesGrid";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const supabase = createClient();
export default async function NotesPage() {
  const { data, error } = await supabase.auth.getUser();
  console.log("data:", data);
  if (error || !data?.user) {
    redirect("/login");
  }
  // const { user } = useAuth();

  return (
    <div
      className={`space-y-6 p-6 min-h-screen transition-colors duration-300`}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p>مرحبا, {data.user.user_metadata.display_name}</p>
          <h1 className="font-bold text-gray-900 dark:text-gray-100">
            ملاحظاتك
          </h1>
        </div>
      </div>

      <NotesGrid />
    </div>
  );
}
