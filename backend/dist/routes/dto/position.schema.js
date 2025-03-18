"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const positionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
    parentId: zod_1.z.string().uuid().nullable().optional()
}).strict();
exports.default = positionSchema;
