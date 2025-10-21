"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import SignInWithGoogleButton from "./SignInWithGoogleButton";

export function LoginForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <Link href="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-10 items-center justify-center rounded-md">
            <Link href="/">
              <Image
                alt="Logo"
                className="h-16 w-16"
                height={64}
                src={"/logo_light.svg"}
                width={64}
              />
            </Link>
          </div>
          <span className="sr-only">NorthStar</span>
        </Link>
        <h1 className="text-xl font-bold">Welcome to NorthStar</h1>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
            required
            type="email"
            value={email}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              href="/auth/forgot-password"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            value={password}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" disabled={isLoading} type="submit">
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <FieldSeparator>Or continue with</FieldSeparator>
        <SignInWithGoogleButton />
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link className="underline underline-offset-4" href="/auth/sign-up">
          Sign up
        </Link>
      </div>
    </form>
  );
}
