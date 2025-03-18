declare const app: import("hono/hono-base").HonoBase<{}, {
    "/*": {};
} | import("hono/types").MergeSchemaPath<import("hono/types").BlankSchema, "/positions"> | import("hono/types").MergeSchemaPath<import("hono/types").BlankSchema, "/auth"> | import("hono/types").MergeSchemaPath<import("hono/types").BlankSchema, "/company-info">, "/">;
export type AppType = typeof app;
export default app;
