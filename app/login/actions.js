"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseSiap } from "@/lib/supabase/config";

export async function login(formData) {
  if (!supabaseSiap) {
    redirect(
      `/login?error=${encodeURIComponent("Database belum disambungkan.")}`,
    );
  }

  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent("Email atau password salah.")}`);
  }

  redirect("/admin");
}

export async function logout() {
  if (!supabaseSiap) {
    redirect("/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
