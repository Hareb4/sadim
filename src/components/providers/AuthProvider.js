"use client"; // Ensure this is a client-side component

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => subscription?.unsubscribe();
  }, [router]);

  // Add the signOut function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); // Clear user state after signing out
    router.push("/"); // Redirect to login page after sign out
  };

  const value = {
    user,
    loading,
    signOut, // Provide the signOut function to the context
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
