"use client";

import { useEffect, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  SuggestionMenuProps,
  useCreateBlockNote,
} from "@blocknote/react";
import {
  BlockNoteView,
  darkDefaultTheme,
  lightDefaultTheme,
  Theme,
} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { locales } from "@blocknote/core";
// import "./style.css";
import { useTheme } from "next-themes";

// Custom component to replace the default Slash Menu.
function CustomSlashMenu(
  props: SuggestionMenuProps<DefaultReactSuggestionItem>
) {
  return (
    <div
      className={`slash-menu absolute z-50 bg-white rounded-lg shadow-lg p-2 w-72 sm:w-96 max-h-60 overflow-y-auto ${
        props.loadingState === "loaded" ? "block" : "hidden"
      }`}
    >
      {props.items.map((item, index) => (
        <div
          key={index}
          className={`slash-menu-item flex items-center p-2 cursor-pointer rounded-md transition-colors duration-200 ${
            props.selectedIndex === index
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100 text-gray-800"
          }`}
          onClick={() => {
            props.onItemClick?.(item);
          }}
        >
          <span className="text-sm font-medium">{item.title}</span>
        </div>
      ))}
    </div>
  );
}
interface BlockNoteEditorProps {
  initialContent: string; // Expecting a JSON string
  onChange: (content: string) => void;
  onHtmlcontent: (html: string) => void;
}

const BlockNoteEditor = ({
  initialContent,
  onChange,
  onHtmlcontent,
}: BlockNoteEditorProps) => {
  const [htmlContent, setHtmlContent] = useState("");
  const { theme } = useTheme();

  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    dictionary: locales.ar,
    domAttributes: {
      editor: {
        dir: "rtl",
        class: "p-4 rounded-md",
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const unsubscribe = editor.onEditorContentChange(() => {
        const blocks = editor.document;
        const jsonContent = JSON.stringify(blocks);
        onChange(jsonContent);

        // Convert blocks to HTML
        editor.blocksToHTMLLossy(blocks).then((html) => {
          setHtmlContent(html);
          onHtmlcontent(html);
        });
      });

      return unsubscribe;
    }
  }, [editor, onChange]);

  return (
    <div className="-mx-[54px] my-4 w-dvw sm:w-full">
      <BlockNoteView
        editor={editor}
        theme={theme === "dark" ? darkDefaultTheme : lightDefaultTheme}
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          lineHeight: "1.5",
        }}
      >
        <SuggestionMenuController
          triggerCharacter={`\\`}
          suggestionMenuComponent={CustomSlashMenu}
        />
      </BlockNoteView>
      <input type="hidden" name="htmlContent" value={htmlContent} />
    </div>
  );
};

export default BlockNoteEditor;
