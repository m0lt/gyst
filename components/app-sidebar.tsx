"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  BarChart3,
  Sparkles,
  X,
  Bell,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SidebarUserMenu } from "@/components/sidebar-user-menu";

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: {
    id: string;
    email: string;
    avatar_url?: string | null;
    full_name?: string | null;
  };
}

export function AppSidebar({ isOpen = false, onClose, user }: AppSidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navigation = [
    {
      name: t("navigation.dashboard"),
      href: "/protected",
      icon: LayoutDashboard,
    },
    {
      name: t("navigation.todo"),
      href: "/protected/todo",
      icon: ListTodo,
    },
    {
      name: t("navigation.tasks"),
      href: "/protected/tasks",
      icon: CheckSquare,
    },
    {
      name: t("navigation.calendar"),
      href: "/protected/calendar",
      icon: CalendarDays,
    },
    {
      name: t("navigation.statistics"),
      href: "/protected/statistics",
      icon: BarChart3,
    },
    {
      name: t("navigation.notifications"),
      href: "/protected/notifications",
      icon: Bell,
    },
  ];

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop: always visible, Mobile: slide in */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 w-64 transform transition-transform duration-300 ease-in-out",
          "md:translate-x-0", // Desktop: always visible
          isOpen ? "translate-x-0" : "-translate-x-full" // Mobile: slide in/out
        )}
      >
        {/* Sidebar content */}
        <div className="flex flex-col h-full border-r border-border/30 bg-background overflow-y-auto">
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between flex-shrink-0 px-6 py-6 border-b border-border/30">
          <Link href="/protected" className="flex items-center gap-3" onClick={handleLinkClick}>
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-display font-bold text-primary">
                {t("navigation.logo")}
              </h1>
              <span className="text-xs font-ornamental text-muted-foreground">
                {t("navigation.beta")}
              </span>
            </div>
          </Link>
          {/* Close button - only visible on mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-2.5 rounded-lg hover:bg-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        {user && (
          <div className="flex-shrink-0 border-t border-border/30 p-4">
            <SidebarUserMenu user={user} onLinkClick={handleLinkClick} />
          </div>
        )}
      </div>
      </aside>
    </>
  );
}
