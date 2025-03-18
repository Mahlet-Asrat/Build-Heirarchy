import { z } from "zod";

const positionSchema = z.object({

    name: z.string().min(1, "Name is required"), 
    description: z.string().optional(),
    parentId: z.string().uuid().nullable().optional()

  }).strict();

export default positionSchema