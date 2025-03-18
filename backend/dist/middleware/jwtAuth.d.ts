import { MiddlewareHandler } from "hono";
import 'dotenv/config';
interface JwtPayload {
    id: string;
}
declare module "hono" {
    interface ContextVariableMap {
        user: JwtPayload;
    }
}
export declare const jwtAuth: MiddlewareHandler;
export {};
