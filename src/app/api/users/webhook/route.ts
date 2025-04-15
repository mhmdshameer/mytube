import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNIN_SECRET;

  if(!SIGNING_SECRET) {
    throw new Error("Missing CLERK_SIGNIN_SECRET");
  }

const wh = new Webhook(SIGNING_SECRET);

const headerPayload = await headers();
const svix_id = headerPayload.get("svix-id");
const svix_signature = headerPayload.get("svix-signature");
const svix_timestamp = headerPayload.get("svix-timestamp");

if(!svix_id || !svix_signature || !svix_timestamp) { 
  return new Response("Missing svix headers", { status: 400 });
}

const payload = await req.json();
const body = JSON.stringify(payload);

let evt: WebhookEvent;

try{
  evt = wh.verify(body, {
    'svix-id':svix_id,
    'svix-signature':svix_signature,
    'svix-timestamp':svix_timestamp
  }) as WebhookEvent;
} catch (err) {
  console.error((err as Error).message);
  return new Response("Invalid svix payload", { status: 400 });
}

const eventType = evt.type;

if(eventType === "user.created") {
  const {data} = evt;
  await db.insert(users).values({
    clerkId: data.id,
    name: `${data.first_name} ${data.last_name}`,
    imageUrl: data.image_url,
  });
}

if(eventType === "user.deleted") {
  const {data} = evt;
 
  if(!data.id){
    return new Response("Missing user ID", { status: 400 });
  }

  await db.delete(users).where(eq(users.clerkId, data.id));
}

if(eventType === "user.updated") {
  const {data} = evt;

  await db
  .update(users)
  .set({
    name: `${data.first_name} ${data.last_name}`,
    imageUrl: data.image_url,
  })
  .where(eq(users.clerkId, data.id));
}
return new Response("Webhook received", { status: 200 } );
}
