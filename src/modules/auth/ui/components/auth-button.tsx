"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Clapperboard, UserCircle } from "lucide-react";

export const AuthButton = () => {
  return (
    <>
      <SignedIn>
        <UserButton>
           <UserButton.MenuItems>
            <UserButton.Link 
              label="Studio"
              href="/studio"
              labelIcon={<Clapperboard className="size-4"/>}
            />
           </UserButton.MenuItems>
        </UserButton >
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
    </>
  );
};
