import { z } from "zod";
declare const signupSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    description?: string | undefined;
}, {
    name: string;
    email: string;
    password: string;
    description?: string | undefined;
}>;
export default signupSchema;
