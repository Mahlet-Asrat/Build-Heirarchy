import { z } from "zod";
import { company } from "../../src/db/schema";



const companySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    description: z.string().optional()
})

type Company = z.infer<typeof companySchema>


declare module "hono"{
    interface ContextVaribaleMap{
        jwtPayload: Company   // "user" is treated as a Company type
    }
}

export default companySchema


