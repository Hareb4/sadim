import React from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";

interface CoverProps {
  url?: string;
  setUrl: (_: string) => void;
}

const Cover: React.FC<CoverProps> = ({ url, setUrl }) => {
  return (
    <div
      className={`relative w-full h-[35vh] bg-neutral-300 !important ${
        !url ? "hidden" : ""
      }`}
    >
      {!!url && (
        <>
          <Image
            src={url}
            alt="Cover"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* <div className="absolute w-1/5 h-1/5 left-2 bottom-2 group flex justify-center items-center ">
            <UploadButton
              className="opacity-0 ut-button:text-sm group-hover:opacity-100 transition-opacity ut-allowed-content:hidden ut-button:bg-neutral-200 ut-button:hover:bg-neutral-300 ut-button:text-neutral-800 ut-button:transition-colors"
              endpoint="imageUploader"
              content={{ button: "ارفع الملفات" }}
              onClientUploadComplete={(res) => {
                setUrl(res[0].url);
              }}
              onBeforeUploadBegin={(files) => {
                // Preprocess files before uploading (e.g. rename them)
                return files.map(
                  (f) => new File([f], "renamed-" + f.name, { type: f.type })
                );
              }}
            />
          </div> */}
        </>
      )}
    </div>
  );
};

export default Cover;
