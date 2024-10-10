import { IBM_Plex_Sans_Arabic } from "next/font/google";
import dynamic from "next/dynamic";

const NoteGrid = dynamic(() => import("../../components/notes/NoteGrid"), {
  ssr: false,
});

const ibmarabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["200", "400", "700"],
});

export default function NotesPage() {
  return (
    <div className={`${ibmarabic.className} `}>
      <NoteGrid />
    </div>
  );
}
