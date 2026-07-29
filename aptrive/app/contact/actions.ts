"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { Database } from "@/lib/database.types";

export type ContactState = { status: "idle" | "sent" | "error"; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const examInterest = String(formData.get("exam") || "").trim() || null;
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { status: "error", error: "Please fill in all required fields." };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", error: "Please enter a valid email address." };
  }
  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return { status: "error", error: "One of the fields is too long." };
  }

  const ip = await getClientIp();
  const { allowed } = await checkRateLimit(`contact:${ip}`, 5, 300);
  if (!allowed) {
    return {
      status: "error",
      error: "Too many messages sent. Please try again in a few minutes.",
    };
  }

  const supabase = await createClient();
  const payload: Database["public"]["Tables"]["contact_messages"]["Insert"] = {
    name,
    email,
    exam_interest: examInterest,
    message,
  };

  const { error } = await supabase
    .from("contact_messages")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- postgrest-js resolves insert payload types to `never` here; see lib/repositories/practice.repository.ts.
    .insert(payload as any);

  if (error) {
    return {
      status: "error",
      error: "Something went wrong sending your message. Please try again.",
    };
  }

  return { status: "sent" };
}
