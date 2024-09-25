"use client";

import ProtectedRoute from "@/components/providers/ProtectedRoute";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "next-themes";

const ibmarabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["200", "400", "700"],
});

export default function Layout({ children }) {
  // State to manage sidebar visibility
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // State to control sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  // Use useEffect to set mounted to true after the component mounts
  useEffect(() => {
    setMounted(true);

    // Function to handle key press
    const handleKeyPress = (event) => {
      if (
        event.altKey &&
        (event.key === "x" || event.key === "X" || event.key === "ء")
      ) {
        toggleSidebar();
      }
    };
    // Add event listener for key press
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Force a re-render when the theme changes
  useEffect(() => {
    if (mounted) {
      // You can add any additional logic here if needed when the theme changes
      console.log("Theme changed to:", theme);
    }
  }, [theme, mounted]);

  if (!mounted) {
    // Return a placeholder or loading state if the component hasn't mounted yet
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div
          className={`h-screen flex flex-col sm:flex-row-reverse ${ibmarabic.className}`}
        >
          {/* Sidebar */}
          {isSidebarVisible && <Sidebar />}

          {/* Main Content */}
          <div className="flex-1 overflow-hidden hide-scrollbar">
            <main className="h-full overflow-y-auto overflow-x-hidden hide-scrollbar">
              {children}
            </main>
          </div>
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}
