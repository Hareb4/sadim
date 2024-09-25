"use client";

import { useTransition } from "react";
import { setUserLocale } from "@/services/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobeIcon } from "@radix-ui/react-icons";

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();

  const langChange = (locale) => {
    console.log(locale);
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  return (
    <div className="flex items-center justify-end">
      <Select onValueChange={langChange} defaultValue="ar" disabled={isPending}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="اختر اللغة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ar">العربية</SelectItem>
          <SelectItem value="en">الانجليزية</SelectItem>
        </SelectContent>
      </Select>
      <GlobeIcon className="ml-2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
