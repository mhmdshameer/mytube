import React, { Suspense } from "react";
import { PageClient } from "./client";
import { HydrateClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  try {
    await trpc.categories.getMany.prefetch();
  } catch (error) {
    console.error("Error prefetching data:", error);
  }
  
  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Something went wrong. Please try again later.</p>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
