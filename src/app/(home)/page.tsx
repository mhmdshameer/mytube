import React, { Suspense } from "react";
import { PageClient } from "./client";
// import { HydrateClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  // void trpc.hello.prefetch({ text: "Shameer" });
  
  return (
    // <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    // </HydrateClient>
  );
}
