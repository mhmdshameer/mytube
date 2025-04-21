import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("=== Webhook Handler Started ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request URL:", req.url);
  console.log("Request Method:", req.method);
  
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;
  console.log("CLERK_SIGNING_SECRET present:", !!SIGNING_SECRET);

  if(!SIGNING_SECRET) {
    console.error("Missing CLERK_SIGNING_SECRET");
    return new NextResponse(JSON.stringify({ error: "Missing CLERK_SIGNING_SECRET" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get raw body
  const payload = await req.text();
  const svix_id = req.headers.get("svix-id");
  const svix_signature = req.headers.get("svix-signature");
  const svix_timestamp = req.headers.get("svix-timestamp");

  console.log("Request details:", {
    headers: {
      svix_id,
      svix_signature: svix_signature ? "present" : "missing",
      svix_timestamp
    },
    bodyLength: payload.length,
    hasSigningSecret: !!SIGNING_SECRET
  });

  if(!svix_id || !svix_signature || !svix_timestamp) { 
    console.error("Missing svix headers");
    return new NextResponse(JSON.stringify({ 
      error: "Missing svix headers",
      headers: { svix_id, svix_signature, svix_timestamp }
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
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
    console.error("Webhook verification failed:", err);
    return new NextResponse(JSON.stringify({ 
      error: "Invalid svix payload",
      details: err instanceof Error ? err.message : "Unknown error"
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const eventType = evt.type;
  const userData = evt.data as {
    id: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string;
    email_addresses: Array<{
      email_address: string;
    }>;
  };

  console.log("Event details:", {
    type: eventType,
    userId: userData.id,
    name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
    email: userData.email_addresses?.[0]?.email_address
  });

  if (eventType === "user.created") {
    try {
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userData.id))
        .limit(1);

      if (existingUser.length > 0) {
        console.log("User already exists, updating instead");
        await db
          .update(users)
          .set({
            name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Anonymous',
            imageUrl: userData.image_url,
          })
          .where(eq(users.clerkId, userData.id));
        console.log("Existing user updated successfully");
      } else {
        await db.insert(users).values({
          clerkId: userData.id,
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Anonymous',
          imageUrl: userData.image_url,
        });
        console.log("New user created successfully");
      }
    } catch (error) {
      console.error("Error handling user:", error);
      return new NextResponse(JSON.stringify({ 
        error: "Error handling user", 
        details: error instanceof Error ? error.message : "Unknown error"
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (eventType === "user.deleted") {
    try {
      if (!userData.id) {
        return new NextResponse(JSON.stringify({ error: "Missing user ID" }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      await db.delete(users).where(eq(users.clerkId, userData.id));
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      return new NextResponse(JSON.stringify({ 
        error: "Error deleting user", 
        details: error instanceof Error ? error.message : "Unknown error"
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (eventType === "user.updated") {
    try {
      await db
        .update(users)
        .set({
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Anonymous',
          imageUrl: userData.image_url,
        })
        .where(eq(users.clerkId, userData.id));
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      return new NextResponse(JSON.stringify({ 
        error: "Error updating user", 
        details: error instanceof Error ? error.message : "Unknown error"
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  console.log("=== Webhook Handler Completed Successfully ===");
  return new NextResponse(JSON.stringify({ success: true }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
