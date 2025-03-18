import { db } from "./src/db";
import { positions } from "./src/db/schema";

async function testConnection() {
  try {
    // Test connection
    console.log('Testing database connection...');
    const result = await db.execute('SELECT 1');
    console.log('Database connection successful:', result);

    // Test query
    console.log('Fetching positions...');
    const positionsData = await db.select().from(positions);
    console.log('Positions:', positionsData);
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection();