import { Hono } from "hono";
import { db } from "../src/db";
import { company } from "../src/db/schema";
import { compare, hash } from "bcryptjs";
import { desc, eq } from "drizzle-orm";
import { HTTPException } from 'hono/http-exception';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import signupSchema from "./dto/signup.schema";
import loginSchema from "./dto/login.schema";
import { z } from "zod";

export const authRoutes = new Hono();

authRoutes.post('/signup', async (c) => {
  try { 

    const body = await c.req.json();
    const validatedUser = signupSchema.parse(body);

    const { name, email, password, description } = validatedUser;

    const hashedPassword = await hash(password, 10);

    const [newUser]: any = await db.insert(company).values({
      name,
      email, 
      password: hashedPassword,
      description: description || null
    }).returning();
    
    return c.json(newUser, 201);  

  } catch (error: any) {

     if (error instanceof z.ZodError) {
      return c.json({ validationErrors: error.format() }, 400);
    }

    if (error.constraint === "User with this email already exists.") {
      return c.json({ error: "Email is already in use." }, 409);
    }

    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected Signup Error:", error);
    return c.json({ error: "Something went wrong. Please try again later." }, 500);
  }
});


authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const validatedUser = loginSchema.parse(body);
    const { email, password } = validatedUser;

    const user = await db.select().from(company).where(eq(company.email, email));

    if (!user.length) {
      return c.json({ error: "Invalid email or password." }, 401);
      }

    const userPassword: any = user[0].password;
    const isValid = await compare(password, userPassword); 

    if (!isValid) {
      return c.json({ error: "Wrong Password." }, 401);
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    return c.json({ token }, 200);  

  } catch (error: any) {
    
    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation failed.", details: error.format() }, 400);
    
    }
  
      return c.json({ error: error.message || "Something went wrong. Please try again later." }, error.status || 500);

  }
});
