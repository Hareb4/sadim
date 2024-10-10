// src/app/components/ProtectedRoute.js
// Ensure this is a client-side component

// import { useEffect } from "react";
// import { useState } from "react";
// import { useAuth } from "./AuthProvider";
// import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const supabase = createClient();

export default function ProtectedRoute({ children }) {
  // const { user, loading } = useAuth();
  const user = supabase.auth.getUser();
  // const router = useRouter();
  console.log(user);

  // Example of logging in the useEffect
  // useEffect(() => {
  //   if (!false) {
  //     console.log("User:", user);
  //     if (!user) {
  //       console.log("go to login");
  //       router.push("/login");
  //     }
  //   }
  // }, [user, router]);

  return user ? children : redirect("/");
}
