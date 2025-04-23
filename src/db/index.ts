import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Use pooled connection
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store',
  },
});

export const db = drizzle(sql);
