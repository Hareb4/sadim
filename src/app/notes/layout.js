import ProtectedRoute from "@/components/providers/ProtectedRoute";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";
import { NotesProvider } from "@/context/NotesContext";
import { Toaster } from "@/components/ui/toaster";

const ibmarabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["200", "400", "700"],
});

export default function Layout({ children }) {
  return (
    <NotesProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div
          className={`h-screen flex flex-col sm:flex-row-reverse ${ibmarabic.className}`}
        >
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 overflow-hidden hide-scrollbar">
            <main className="h-full overflow-y-auto overflow-x-hidden hide-scrollbar">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    </NotesProvider>
  );
}
