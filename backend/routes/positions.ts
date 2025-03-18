import { Hono } from "hono";
import { db } from "../src/db/index.js";
import { company, positions } from "../src/db/schema.js";
import { eq, ilike, isNull, not, or } from "drizzle-orm";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { JwtPayload } from "jsonwebtoken";
import { error } from "console";
import { HTTPException } from "hono/http-exception";
import { d } from "drizzle-kit/index-BAUrj6Ib.js";
import positionSchema from "./dto/position.schema.js";
import { z } from "zod";

const positionRoutes = new Hono();

positionRoutes.use(jwtAuth)

positionRoutes.post("/", async (c) => { // post positions with parent_id and only one null is allowed for parents_Id

  try { 

      const company = c.get("user")
      
      if(!company){
        return c.json({error: "Unauthorized: Please Login First"}, 401)
      }

      const body = await c.req.json();

      const validBody = positionSchema.parse(body)

      if(!validBody.parentId || validBody.parentId === ""){ 

        const formerNull = await db.select().from(positions).where(isNull(positions.parentId))

        if (formerNull.length > 0){
          return c.json({ error: "Only one position can be a root per company" }, 400)
        }
        
      }

      const [newPosition] :any = await db.insert(positions).values({
        name: validBody.name,
        description: validBody.description,
        parentId: validBody.parentId, 
        companyId: company.id
      }).returning();

      return c.json(newPosition, 201);

    } catch(error: any){

      if (error instanceof z.ZodError) {
        return c.json({ error: error.errors[0].message }, 400);
      }
  
      if (error.constraint) {
        return c.json({ error: error.constraint }, 400);
      }
  
      return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
  
});

positionRoutes.get('/all', async (c) => {

  const myPositions = await db.select().from(positions);
    const positionsData = myPositions.map((position) => {
    return {
      ...position,
      id: position.id.toString(), 
      name: position.name.toString(),
      description: position.description.toString(),
      parentId : position.parentId? position.parentId.toString(): null
    };
  });

  return c.json(positionsData); 
});

positionRoutes.get("/", async (c) => {
  
  try { 

      const company = c.get('user')

      if(!company){
        return c.json({error: "Unauthorized: Please Login First"}, 401)
      }

      const page = Number(c.req.query('page')) || 1
      const limit = 6 
      const offset = (page - 1) * limit

      const allPositions = await db.select().from(positions).limit(limit).offset(offset)
      
      if (!allPositions.length){
        return c.text("No Position has been added by this company")
      }

      return c.json({ page, limit, positions: allPositions});
      
  }catch(error: any){

    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }

    if (error.constraint) {
      return c.json({ error: error.constraint }, 400);
    }

    return c.json({ error: error.message || "Internal Server Error" }, 500);
  }
});


positionRoutes.get("/search", async (c) => {
  try {
    
    const query = c.req.query("q");

    if (!query) {
      return c.json({ error: "Search query is required" }, 400);
    }

    const company = c.get("user") as JwtPayload;

    if (!company) {
      return c.json({ error: "Unauthorized: Please Login First" }, 401);
    }

    const results = await db
      .select()
      .from(positions)
      .where(
        or(
          ilike(positions.name, `%${query}%`),
          ilike(positions.description, `%${query}%`)
        )
      );

    if (!results.length) {
      return c.json({ message: "No matching positions found" });
    }

    return c.json(results);
  } catch (error: any) {
    return c.json({ error: error.message || "Internal Server Error" }, 500);
  }
});



positionRoutes.get('/tree' , async (c) =>{

  const getHierarchy : any = async (parentId: string | null) =>{

      const children = await db.select().from(positions).where(
        parentId === null ? isNull(positions.parentId) : eq(positions.parentId, parentId)
      );
      
      return await Promise.all(children.map(async (pos)=>({
          ...pos,
          children: await getHierarchy(pos.id)
      })))
  }

  const hierarchy = await getHierarchy(null)

  return c.json(hierarchy)

})

positionRoutes.get('/root', async (c) => {

  try {
    console.log("Fetching root positions...");

    const rootPos = await db.select().from(positions).where(isNull(positions.parentId)).execute();

    console.log("Root positions:", rootPos);

    if (!rootPos || rootPos.length === 0) {
      return c.json({ message: "No root position found" }, 404);
    }

    return c.json(rootPos, 200);

  } catch (error: any) {
    console.error("Error fetching root positions:", error);
    return c.json({ error: error.message || "Internal Server Error" }, 500);
  }
});

positionRoutes.get('/children/:id', async (c) =>{

  try { 

  const id = c.req.param('id')
  
  const children = await db.select().from(positions).where(eq(positions.parentId,id))

  if(!children.length){
    return c.json({message: "This position has no subordinate"})
  }

  return c.json(children, 200)

  }  catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors.map(e => e.message).join(", ") }, 400);
    }

    if (error.constraint) {
      return c.json({ error: error.constraint }, 400);
    }

  return c.json({ error: error.message || "Internal Server Error" }, 500);
  }
}) 


positionRoutes.get("/:id", async (c) => {

  try {

    const id = c.req.param("id");

    const position = await db.select().from(positions).where(eq(positions.id, id));

    if (!position.length){
      throw new HTTPException(404, {  })
    }

    return c.json(position[0]);

  } catch(error: any){

    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }

    if (error.constraint) {
      return c.json({ error: error.constraint }, 400);
    }

    return c.json({ error: error.message || "Internal Server Error" }, 500);
  }
});


positionRoutes.delete('/:id', async (c) => {

  try { 

  const id = c.req.param('id');

  const hasChildren = await db.select().from(positions).where(eq(positions.parentId, id))

  if (hasChildren.length > 0){
    return c.json({error: "Position with subordinate can't be deleted"}, 400)
  }

  const positionToDelete = await db.select().from(positions).where(eq(positions.id, id));

  if (!positionToDelete.length) {
    return c.json({ error: "Position not found" }, 404);
  }

  const deletedPosition = await db.delete(positions).where(eq(positions.id, id));

  if (deletedPosition.rowCount === 0) {
    return c.json({ error: "Position not found" }, 404);
  }

  return c.json(positionToDelete[0]);
} catch(error: any){

  if (error instanceof z.ZodError) {
    return c.json({ error: error.errors }, 400);
  }

  if (error.constraint) {
    return c.json({ error: error.constraint }, 400);
  }

  return c.json({ error: error.message || "Internal Server Error" }, 500);

}
});


positionRoutes.put('/:id', async (c) => {
  try {

    const id = c.req.param('id');
    const body = await c.req.json();

    if (body.parentId === "none" || body.parentId === null || body.parentId === "") {
      body.parentId = null;
    }

    const validParents = await db
      .select()
      .from(positions)
      .where(not(eq(positions.id, id))) // Exclude self
      .then((allPositions) => {
        const findDescendants = (id: string, positionsList: any[]): string[] => {
          const children = positionsList.filter(pos => pos.parentId === id);
          let descendants: string[] = children.map(child => child.id);

          for (const child of children) {
            descendants = descendants.concat(findDescendants(child.id, positionsList));
          }

          return descendants;
        };

        const descendants = findDescendants(id, allPositions);
        descendants.push(id); 

        return allPositions.filter(pos => !descendants.includes(pos.id));
      });

    if (body.parentId !== null && !validParents.some(p => p.id === body.parentId)) {
      return c.json({ error: "Invalid parent: must be a valid position" }, 400);
    }

    const validBody = positionSchema.partial().parse(body);

    const updatedPosition = await db.update(positions).set(validBody).where(eq(positions.id, id)).returning();

    if (!updatedPosition || updatedPosition.length === 0) {
      return c.json({ error: "Position not found" }, 404);
    }

    return c.json(updatedPosition[0]);

  } catch (error: any) {
    return c.json({ error: error.message || "Internal Server Error" }, 500);
  }
});





positionRoutes.get('/validParent/:id', async (c) => {
  try {
    const positionId = c.req.param("id");

    const allPositions = await db.select().from(positions);

    const findDescendants = (id: string, positionsList: any[]): string[] => {

      const children = positionsList.filter(pos => pos.parentId === id);

      let descendants: string[] = children.map(child => child.id);

      for (const child of children) {
        
        descendants = descendants.concat(findDescendants(child.id, positionsList));
      }

      return descendants;
    };

    const descendants = findDescendants(positionId, allPositions);
    descendants.push(positionId); 

    const validParents = allPositions.filter(pos => !descendants.includes(pos.id));

    return c.json(validParents);

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors.map(e => e.message).join(", ") }, 400);
    }

    if (error.constraint) {
      return c.json({ error: error.constraint }, 400);
    }

  return c.json({ error: error.message || "Internal Server Error" }, 500);
  }
});



export default positionRoutes;
