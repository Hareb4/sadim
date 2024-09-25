import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const Header = () => {
  return (
    <header className="border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Input
          type="search"
          placeholder="البحث في الملاحظات..."
          className="w-64"
        />
        <Button size="icon" variant="ghost">
          <MagnifyingGlassIcon className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
