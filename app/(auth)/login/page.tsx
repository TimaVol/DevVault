"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2, Lock, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/utils/errors";
import { signInWithEmail, signUpWithEmail } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await signUpWithEmail({ email, password });
        if (res.success) {
          toast.success(res.message || "Registration successful!");
          setIsSignUp(false);
        } else {
          toast.error(res.error || "Failed to register");
        }
      } else {
        const res = await signInWithEmail({ email, password });
        if (res.success) {
          toast.success("Welcome back to your DevVault!");
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.error(res.error || "Invalid email or password");
        }
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16 bg-background overflow-hidden">
      {/* Background visual patterns matching DESIGN.md */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--color-primary)/10,transparent_50%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <Card className="relative w-full max-w-md border-border-subtle bg-surface-card/60 backdrop-blur-xl shadow-2xl transition-all duration-300">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary text-[10px] font-bold text-primary-foreground">
                DV
              </div>
              <span className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                DevVault
              </span>
            </Link>
            <div className="flex items-center gap-1 rounded-full border border-border-subtle bg-surface-container-low px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              <Shield className="h-3 w-3 text-primary-fixed-dim" />
              <span>Secure Auth</span>
            </div>
          </div>
          <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {isSignUp ? "Create your workspace" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {isSignUp
              ? "Sign up for a personal DevVault developer workspace"
              : "Sign in to manage snippets, projects, and checklists"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5" htmlFor="email">
                <Mail className="h-3.5 w-3.5" />
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input/50 border-border-subtle focus-visible:ring-primary text-sm h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5" htmlFor="password">
                <Lock className="h-3.5 w-3.5" />
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input/50 border-border-subtle focus-visible:ring-primary text-sm h-10"
              />
            </div>
            <Button
              className="w-full font-display font-medium h-10 mt-2 bg-primary hover:bg-primary-container text-primary-foreground flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Sign up" : "Sign in"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <span className="relative bg-surface-card px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Or
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full h-10 border-border-subtle bg-surface-container-low/50 hover:bg-accent text-foreground hover:text-foreground flex items-center justify-center gap-2 cursor-pointer transition-colors"
            onClick={() => {
              toast.info("Google OAuth is enabled. Click redirect to sign in.");
              window.location.href = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${window.location.origin}/dashboard`;
            }}
          >
            <svg
              className="h-4 w-4 mr-1"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {isSignUp ? "Already have an account? " : "New to DevVault? "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-medium hover:underline hover:text-primary-container bg-transparent border-0 cursor-pointer p-0"
            >
              {isSignUp ? "Sign in" : "Create an account"}
            </button>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
