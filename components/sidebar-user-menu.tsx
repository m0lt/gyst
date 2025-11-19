"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

interface SidebarUserMenuProps {
  user: {
    id: string;
    email: string;
    avatar_url?: string | null;
    full_name?: string | null;
  };
  onLinkClick?: () => void;
}

export function SidebarUserMenu({ user, onLinkClick }: SidebarUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const displayName = user.full_name || user.email.split("@")[0];
  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className="relative">
      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 right-0 mb-2 z-50 w-full min-w-[200px] rounded-lg border border-border/50 bg-background shadow-lg overflow-hidden"
            >
              <div className="p-2 space-y-1">
                <Link
                  href="/protected/settings"
                  onClick={handleMenuItemClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors min-h-[40px]"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    handleMenuItemClick();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors text-left min-h-[40px]"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-lg transition-colors min-h-[60px]",
          "hover:bg-accent",
          isOpen && "bg-accent"
        )}
      >
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarImage src={user.avatar_url || undefined} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-mucha-mauve to-mucha-gold text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>

        <ChevronUp
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}
