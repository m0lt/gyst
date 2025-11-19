import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-organic-pattern">
      {/* Navigation */}
      <nav className="w-full border-b border-border/30 backdrop-blur-md bg-background/80 sticky top-0 z-50 card-art-nouveau">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-primary">Gyst</h1>
            <span className="text-xs font-ornamental text-muted-foreground">BETA</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="heading-1 gradient-text-hero">
            Your Life, Organized
          </h1>
          <p className="text-lead max-w-2xl mx-auto">
            A beautiful life organizer with task management, streaks, and AI-powered suggestions
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/sign-up">
              <Button size="lg" variant="default">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Ornamental Divider */}
        <div className="ornament-divider my-16 max-w-md mx-auto"></div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="heading-2 text-center mb-4">Everything You Need</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Gyst combines elegant design with powerful features to help you organize your life
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card-art-nouveau">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <CardTitle>Smart Task Management</CardTitle>
              <CardDescription>
                Organize tasks by category with customizable recurring schedules and priorities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-art-nouveau">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle>Streak Tracking</CardTitle>
              <CardDescription>
                Build lasting habits with visual streak tracking and achievement milestones
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-art-nouveau">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <CardTitle>AI-Powered Suggestions</CardTitle>
              <CardDescription>
                Get personalized task suggestions based on your lifestyle and preferences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-art-nouveau">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <CardTitle>Statistics & Insights</CardTitle>
              <CardDescription>
                Track your progress with beautiful charts and detailed analytics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-art-nouveau">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <CardTitle>Beautiful Themes</CardTitle>
              <CardDescription>
                Elegant design with multiple beautiful themes to choose from
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-art-nouveau">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <CardTitle>Smart Notifications</CardTitle>
              <CardDescription>
                Stay on track with intelligent reminders and progress updates
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <Card className="bg-mucha text-card-foreground">
          <CardHeader>
            <CardTitle className="heading-3 text-primary-foreground">Ready to Get Organized?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Start your journey to a more organized life with Gyst
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" variant="secondary">
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border/30 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              className="font-semibold hover:text-primary transition-colors"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
