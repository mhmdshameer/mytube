import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  console.log("Webhook received at:", new Date().toISOString());
  
  try {
    // Log headers for debugging
    const headers = req.headers;
    console.log("Request headers:", {
      'svix-id': headers.get('svix-id'),
      'svix-timestamp': headers.get('svix-timestamp'),
      'svix-signature': headers.get('svix-signature') ? 'present' : 'missing'
    });

    const evt = await verifyWebhook(req) as WebhookEvent;
    const eventType = evt.type;
    const data = evt.data as { id: string; first_name: string; last_name: string; image_url: string };

    console.log(`Received webhook with ID ${data.id} and event type of ${eventType}`);
    console.log('Webhook payload:', data);

    if (eventType === "user.created") {
      try {
        await db.insert(users).values({
          clerkId: data.id,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        console.log("User created successfully");
      } catch (error) {
        console.error("Error creating user:", error);
        return new NextResponse(JSON.stringify({ error: "Error creating user", details: error }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (eventType === "user.deleted") {
      try {
        if (!data.id) {
          return new NextResponse("Missing user ID", { status: 400 });
        }
        await db.delete(users).where(eq(users.clerkId, data.id));
        console.log("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        return new NextResponse(JSON.stringify({ error: "Error deleting user", details: error }), { 
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
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url,
          })
          .where(eq(users.clerkId, data.id));
        console.log("User updated successfully");
      } catch (error) {
        console.error("Error updating user:", error);
        return new NextResponse(JSON.stringify({ error: "Error updating user", details: error }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse(JSON.stringify({ 
      error: "Error verifying webhook", 
      details: err instanceof Error ? err.message : "Unknown error"
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
