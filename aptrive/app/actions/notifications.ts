"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  toggleNotificationRead,
  markAllNotificationsRead,
} from "@/lib/repositories/notifications.repository";

export async function toggleNotificationReadAction(notificationId: string, markAsRead: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in.");

  await toggleNotificationRead(supabase, user.id, notificationId, markAsRead);
  revalidatePath("/", "layout");
}

export async function markAllNotificationsReadAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in.");

  await markAllNotificationsRead(supabase, user.id);
  revalidatePath("/", "layout");
}
