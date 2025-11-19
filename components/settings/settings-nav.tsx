"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Bell,
  Palette,
  Languages,
  Tags,
  Calendar,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function SettingsNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const settingsNav = [
    {
      name: t("settings.nav.profile"),
      href: "/protected/settings",
      icon: User,
      description: t("settings.nav.profileDesc"),
    },
    {
      name: t("settings.nav.notifications"),
      href: "/protected/settings/notifications",
      icon: Bell,
      description: t("settings.nav.notificationsDesc"),
    },
    {
      name: t("settings.nav.categories"),
      href: "/protected/settings/categories",
      icon: Tags,
      description: t("settings.nav.categoriesDesc"),
    },
  ];

  return (
    <div className="mb-8">
      <nav className="flex gap-2 overflow-x-auto pb-2">
        {settingsNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border",
                isActive
                  ? "bg-mucha-mauve text-white border-mucha-mauve"
                  : "bg-background text-muted-foreground hover:bg-accent border-border"
              )}
            >
              <Icon className="w-4 h-4" />
              <div className="flex flex-col">
                <span>{item.name}</span>
                {isActive && (
                  <span className="text-xs opacity-80">{item.description}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
