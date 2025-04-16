import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  console.log("Webhook received at:", new Date().toISOString());
  
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if(!SIGNING_SECRET) {
    console.error("Missing CLERK_SIGNING_SECRET");
    throw new Error("Missing CLERK_SIGNING_SECRET");
  }

  const wh = new Webhook(SIGNING_SECRET);

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
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  console.log("Webhook payload:", JSON.stringify(payload, null, 2));
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try{
    evt = wh.verify(body, {
      'svix-id':svix_id,
      'svix-signature':svix_signature,
      'svix-timestamp':svix_timestamp
    }) as WebhookEvent;
    console.log("Webhook verification successful");
  } catch (err) {
    console.error("Webhook verification failed:", (err as Error).message);
    console.error("Verification details:", {
      bodyLength: body.length,
      headersPresent: {
        svix_id: !!svix_id,
        svix_signature: !!svix_signature,
        svix_timestamp: !!svix_timestamp
      }
    });
    return new Response("Invalid svix payload", { status: 400 });
  }

  const eventType = evt.type;
  console.log("Event type:", eventType);

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
      return new Response("Error creating user", { status: 500 });
    }
  }

  if(eventType === "user.deleted") {
    const {data} = evt;
    try {
      if(!data.id){
        console.error("Missing user ID for deletion");
        return new Response("Missing user ID", { status: 400 });
      }
      await db.delete(users).where(eq(users.clerkId, data.id));
      console.log("User deleted successfully");
    } catch (error) {
      const err = error as Error;
      console.error("Error deleting user:", err.message);
      console.error("Full error:", err);
      return new Response("Error deleting user", { status: 500 });
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
      return new Response("Error updating user", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
