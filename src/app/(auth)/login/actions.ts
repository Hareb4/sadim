"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: session, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  if (session) {
    // Set session cookies on the server-side for client-side access
    const token = session.session.access_token;
    cookies().set("token", token);
    // Set the session token using cookies or any session management approach
    // for example, using `cookies().set()` (in Next.js 13/14), or similar

    revalidatePath("/", "layout"); // Invalidate cache for protected routes
    redirect("/notes");
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/notes");
}
