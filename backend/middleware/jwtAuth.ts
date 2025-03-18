import { verify } from "hono/jwt";
import { MiddlewareHandler, Context } from "hono";
import { HTTPException } from "hono/http-exception";
import 'dotenv/config';

interface JwtPayload{
  id: string,
}

declare module "hono" {
  interface ContextVariableMap {
    user: JwtPayload;
  }

}


export const jwtAuth: MiddlewareHandler= async (c, next) => {
  
  try {

    const token = c.req.header("Authorization");

    if (!token) {
      return c.json({ message: "Unauthorized: No token Provided" }, 401);
    }

    const secret = process.env.JWT_SECRET!;

    const decoded = await verify(token, secret) as unknown as JwtPayload;

    if (!decoded) {
      return c.json({ message: "Unauthorized: Invalid token" }, 401);
    }

    c.set("user", decoded);
    
    await next();

  } catch (error) {
    console.error("JWT Authentication Error:", error);
    throw new HTTPException(401, { message: "Unauthorized: Invalid or expired token" });
  }
};
