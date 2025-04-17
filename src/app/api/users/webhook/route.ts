import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Webhook received at:", new Date().toISOString());
  
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if(!SIGNING_SECRET) {
    console.error("Missing CLERK_SIGNING_SECRET");
    return new NextResponse("Missing CLERK_SIGNING_SECRET", { status: 500 });
  }

  // Get raw body
  const payload = await req.text();
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_signature = headerPayload.get("svix-signature");
  const svix_timestamp = headerPayload.get("svix-timestamp");

  console.log("Received headers:", {
    svix_id,
    svix_signature: svix_signature ? "present" : "missing",
    svix_timestamp
  });

  if(!svix_id || !svix_signature || !svix_timestamp) { 
    console.error("Missing svix headers");
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const wh = new Webhook(SIGNING_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log("Webhook verification successful");
  } catch (err) {
    console.error("Webhook verification failed:", (err as Error).message);
    console.error("Verification details:", {
      bodyLength: payload.length,
      headersPresent: {
        svix_id: !!svix_id,
        svix_signature: !!svix_signature,
        svix_timestamp: !!svix_timestamp
      }
    });
    return new NextResponse("Invalid svix payload", { status: 400 });
  }

  const eventType = evt.type;
  console.log("Event type:", eventType);
  console.log("Event data:", evt.data);

  if(eventType === "user.created") {
    const {data} = evt;
    console.log("Creating user with data:", data);
    try {
      await db.insert(users).values({
        clerkId: data.id,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      });
      console.log("User created successfully");
    } catch (error) {
      const err = error as Error;
      console.error("Error creating user:", err.message);
      console.error("Full error:", err);
      return new NextResponse("Error creating user", { status: 500 });
    }
  }

  if(eventType === "user.deleted") {
    const {data} = evt;
    try {
      if(!data.id){
        console.error("Missing user ID for deletion");
        return new NextResponse("Missing user ID", { status: 400 });
      }
      await db.delete(users).where(eq(users.clerkId, data.id));
      console.log("User deleted successfully");
    } catch (error) {
      const err = error as Error;
      console.error("Error deleting user:", err.message);
      console.error("Full error:", err);
      return new NextResponse("Error deleting user", { status: 500 });
    }
  }

  if(eventType === "user.updated") {
    const {data} = evt;
    try {
      await db
        .update(users)
        .set({
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        })
        .where(eq(users.clerkId, data.id));
      console.log("User updated successfully");
    } catch (error) {
      const err = error as Error;
      console.error("Error updating user:", err.message);
      console.error("Full error:", err);
      return new NextResponse("Error updating user", { status: 500 });
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
