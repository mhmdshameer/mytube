"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UserCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const AuthButton = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button
        variant="outline"
        className="px-4 py-2 text-sm font-medium rounded-full text-blue-600 hover:text-blue-500 border-blue-500/20 shadow-none"
        suppressHydrationWarning
      >
        <UserCircle />
        Loading...
      </Button>
    );
  }

  return (
    <div suppressHydrationWarning>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="px-4 py-2 text-sm font-medium rounded-full text-blue-600 hover:text-blue-500 border-blue-500/20 shadow-none"
          >
            <UserCircle />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
};
