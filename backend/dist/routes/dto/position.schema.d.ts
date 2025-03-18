import { z } from "zod";
declare const positionSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strict", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    parentId?: string | null | undefined;
}, {
    name: string;
    description?: string | undefined;
    parentId?: string | null | undefined;
}>;
export default positionSchema;
