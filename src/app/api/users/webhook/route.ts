import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  console.log('Webhook received')
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET

  if (!SIGNING_SECRET) {
    console.error('Missing CLERK_SIGNING_SECRET')
    throw new Error('Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers:', { svix_id, svix_timestamp, svix_signature })
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  const eventType = evt.type
  console.log('Webhook event type:', eventType)
  console.log('Webhook payload:', body)
  
  try {
    if(eventType === 'user.created') {
      console.log('Creating new user')
      const {data} = evt
      if (!data.id || !data.first_name || !data.last_name || !data.image_url) {
        console.error('Missing required user data:', data)
        return new Response('Error: Missing required user data', { status: 400 })
      }
      await db.insert(users).values({
        clerkId: data.id,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url
      })
      console.log('User created successfully')
    }

    if(eventType === 'user.deleted') {
      console.log('Deleting user')
      const {data} = evt
      if(!data.id){
        console.error('Missing user ID for deletion')
        return new Response("Missing user ID", {status: 400})
      }
      await db.delete(users).where(eq(users.clerkId, data.id))
      console.log('User deleted successfully')
    }

    if(eventType === 'user.updated') {
      console.log('Updating user')
      const {data} = evt
      if (!data.id || !data.first_name || !data.last_name || !data.image_url) {
        console.error('Missing required user data for update:', data)
        return new Response('Error: Missing required user data', { status: 400 })
      }
      await db.update(users)
        .set({
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url
        })
        .where(eq(users.clerkId, data.id))
      console.log('User updated successfully')
    }
  } catch (error) {
    console.error('Database operation failed:', error)
    return new Response('Error: Database operation failed', { status: 500 })
  }

  return new Response('Webhook processed successfully', { status: 200 })
}