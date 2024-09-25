// src/app/components/ProtectedRoute.js
"use client"; // Ensure this is a client-side component

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return user ? children : null;
}
