import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ClientWrapper } from "@/components/client-wrapper";
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyTube",
  description:
    "A platform for video upload, streaming, user authentication, and interactive features like likes and comments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <ClientWrapper>
            <TRPCProvider>
              <Toaster />
              {children}
            </TRPCProvider>
            </ClientWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
