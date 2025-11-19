"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  user?: {
    id: string;
    email: string;
    avatar_url?: string | null;
    full_name?: string | null;
  };
}

export function DashboardLayoutClient({ children, headerActions, user }: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-organic-pattern">
      {/* Sidebar */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Main Content with Sidebar Offset */}
      <div className="md:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-border/30 backdrop-blur-md bg-background/80">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Hamburger Menu - Mobile Only */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h2 className="text-lg font-semibold">Your Dashboard</h2>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {headerActions}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 py-6 md:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/30 mt-20">
          <div className="px-4 md:px-6 py-8 text-center text-sm text-muted-foreground">
            <p>
              Powered by{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                className="font-semibold transition-colors"
                rel="noreferrer"
              >
                Supabase
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
