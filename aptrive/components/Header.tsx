import SiteNav from "@/components/SiteNav";
import type { HeaderUser } from "@/components/UserMenu";
import type { NotificationItem } from "@/components/NotificationBell";

export default function Header({ 
  user = null, 
  notifications = [], 
  unreadCount = 0 
}: { 
  user?: HeaderUser | null;
  notifications?: NotificationItem[];
  unreadCount?: number;
}) {
  return <SiteNav user={user} notifications={notifications} unreadCount={unreadCount} />;
}
