import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return Response.json({ 
      success: true, 
      count: allUsers.length,
      users: allUsers 
    });
  } catch (error) {
    console.error("Database query error:", error);
    return Response.json({ 
      success: false, 
      error: "Failed to query database" 
    }, { status: 500 });
  }
} 