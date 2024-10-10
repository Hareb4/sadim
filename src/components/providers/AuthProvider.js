"use client"; // Ensure this is a client-side component

import { createContext, useContext, useState, useEffect } from "react";
// import { supabase } from "../../lib/supabaseClient";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // console.log(router);

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.log("no user");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    }
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // useEffect(() => {
  //   const getSession = async () => {
  //     const {
  //       data: { session },
  //       error,
  //     } = await supabase.auth.getSession();

  //     console.log("Session data:", session); // Check session on load
  //     if (error) console.error("Session error:", error);

  //     setUser(session?.user || null); // Set the authenticated user
  //     setLoading(false);
  //   };
  //   getSession();

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     setUser(session?.user || null);
  //     if (event === "SIGNED_OUT") {
  //       router.push("/login");
  //     }
  //   });

  //   return () => subscription?.unsubscribe();
  // }, [router]);

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
