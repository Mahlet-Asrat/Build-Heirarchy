
import { serve } from "@hono/node-server";
import app from "./app";

const port = 3000

serve({
    fetch: app.fetch, 
    port: Number(port)
})

console.log(`Server is running on http://localhost:${port}...`);

