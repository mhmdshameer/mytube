import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  try {
    // Test database connection
    const allUsers = await db.select().from(users);
    
    // Log environment variables (without exposing sensitive data)
    
    return Response.json({ 
      success: true, 
      userCount: allUsers.length,
      users: allUsers,
      envCheck: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasSigningSecret: !!process.env.CLERK_SIGNING_SECRET
      }
    });
  } catch (error) {
    console.error("Database test error:", error);
    return Response.json({ 
      success: false, 
      error: "Failed to query database",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 