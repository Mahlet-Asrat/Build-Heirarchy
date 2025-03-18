import { Hono } from "hono";
import { db } from "../src/db";
import { eq } from "drizzle-orm";
import { jwtAuth } from "../middleware/jwtAuth";
import { company, positions } from "../src/db/schema";

export const companyRoutes = new Hono();

companyRoutes.use(jwtAuth);

companyRoutes.get("/", async (c) => {
    
  try {
    
    const user = c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const userCompany = await db.select().from(company).where(eq(company.id, user.id));

    if (!userCompany.length) {
      return c.json({ message: "Company not found" }, 404);
    }

    const Availpositions = await db.select().from(positions).where(eq(positions.companyId, user.id));

    return c.json({

      company: { name: userCompany[0].name, email: userCompany[0].email, description: userCompany[0].description,  },
      hasPositions: Availpositions.length > 0,
      
    });

  } catch (error) {

    console.error("Error fetching company info:", error);
    return c.json({ message: "Internal Server Error" }, 500);

  }
});
