"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import React, { useState } from "react";

interface SignInWithGoogleButtonProps {
  type?: "login" | "signup";
}

const SignInWithGoogleButton: React.FC<SignInWithGoogleButtonProps> = ({
  type = "login",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const redirectUrl = new URL(`${window.location.origin}/auth/oauth`);
      redirectUrl.searchParams.set("next", "/dashboard");

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl.toString(),
        },
      });
    } catch {
      setError("Failed to connect with Google. Please try again.");
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
          {error}
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        {isLoading
          ? "Connecting..."
          : type === "signup"
          ? "Sign up with Google"
          : "Login with Google"}
      </Button>
    </>
  );
};

export default SignInWithGoogleButton;
