"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PersonIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons";
import { ThemeToggle } from "./ThemeToggle";
import LocalSwitcher from "@/components/customeui/LocaleSwitcherSelect";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

const UserMenu = () => {
  const router = useRouter();
  // const { signOut } = useAuth();
  const user = supabase.auth.getUser();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Force re-render on theme change
    if (mounted) {
      router.refresh();
    }
  }, [theme, mounted, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    // setUser(null); // Clear user state after signing out
    router.push("/"); // Redirect to login page after sign out
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to login page or home page after sign out
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border text-right">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 active:outline-none focus:ring-0 focus-visible:ring-0"
          >
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className={"hidden items-center justify-end"}>
            <span>الملف الشخصي</span> <PersonIcon className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className={"hidden items-center justify-end"}>
            <span>الإعدادات</span> <GearIcon className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            className={"flex items-center justify-end"}
          >
            <span>تسجيل الخروج</span> <ExitIcon className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LocalSwitcher />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
