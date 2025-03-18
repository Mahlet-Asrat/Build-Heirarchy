"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const index_js_1 = require("../src/db/index.js");
const schema_js_1 = require("../src/db/schema.js");
const drizzle_orm_1 = require("drizzle-orm");
const jwtAuth_js_1 = require("../middleware/jwtAuth.js");
const http_exception_1 = require("hono/http-exception");
const position_schema_js_1 = __importDefault(require("./dto/position.schema.js"));
const zod_1 = require("zod");
const positionRoutes = new hono_1.Hono();
positionRoutes.use(jwtAuth_js_1.jwtAuth);
positionRoutes.post("/", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = c.get("user");
        if (!company) {
            return c.json({ error: "Unauthorized: Please Login First" }, 401);
        }
        const body = yield c.req.json();
        const validBody = position_schema_js_1.default.parse(body);
        if (!validBody.parentId || validBody.parentId === "") {
            const formerNull = yield index_js_1.db.select().from(schema_js_1.positions).where((0, drizzle_orm_1.isNull)(schema_js_1.positions.parentId));
            if (formerNull.length > 0) {
                return c.json({ error: "Only one position can be a root per company" }, 400);
            }
        }
        const [newPosition] = yield index_js_1.db.insert(schema_js_1.positions).values({
            name: validBody.name,
            description: validBody.description,
            parentId: validBody.parentId,
            companyId: company.id
        }).returning();
        return c.json(newPosition, 201);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return c.json({ error: error.errors[0].message }, 400);
        }
        if (error.constraint) {
            return c.json({ error: error.constraint }, 400);
        }
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
}));
positionRoutes.get('/all', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const myPositions = yield index_js_1.db.select().from(schema_js_1.positions);
    const positionsData = myPositions.map((position) => {
        return Object.assign(Object.assign({}, position), { id: position.id.toString(), name: position.name.toString(), description: position.description.toString(), parentId: position.parentId ? position.parentId.toString() : null });
    });
    return c.json(positionsData);
}));
positionRoutes.get("/", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = c.get('user');
        if (!company) {
            return c.json({ error: "Unauthorized: Please Login First" }, 401);
        }
        const page = Number(c.req.query('page')) || 1;
        const limit = 6;
        const offset = (page - 1) * limit;
        const allPositions = yield index_js_1.db.select().from(schema_js_1.positions).limit(limit).offset(offset);
        if (!allPositions.length) {
            return c.text("No Position has been added by this company");
        }
        return c.json({ page, limit, positions: allPositions });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return c.json({ error: error.errors }, 400);
        }
        if (error.constraint) {
            return c.json({ error: error.constraint }, 400);
        }
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
}));
positionRoutes.get("/search", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = c.req.query("q");
        if (!query) {
            return c.json({ error: "Search query is required" }, 400);
        }
        const company = c.get("user");
        if (!company) {
            return c.json({ error: "Unauthorized: Please Login First" }, 401);
        }
        const results = yield index_js_1.db
            .select()
            .from(schema_js_1.positions)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_js_1.positions.name, `%${query}%`), (0, drizzle_orm_1.ilike)(schema_js_1.positions.description, `%${query}%`)));
        if (!results.length) {
            return c.json({ message: "No matching positions found" });
        }
        return c.json(results);
    }
    catch (error) {
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
}));
positionRoutes.get('/tree', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const getHierarchy = (parentId) => __awaiter(void 0, void 0, void 0, function* () {
        const children = yield index_js_1.db.select().from(schema_js_1.positions).where(parentId === null ? (0, drizzle_orm_1.isNull)(schema_js_1.positions.parentId) : (0, drizzle_orm_1.eq)(schema_js_1.positions.parentId, parentId));
        return yield Promise.all(children.map((pos) => __awaiter(void 0, void 0, void 0, function* () {
            return (Object.assign(Object.assign({}, pos), { children: yield getHierarchy(pos.id) }));
        })));
    });
    const hierarchy = yield getHierarchy(null);
    return c.json(hierarchy);
}));
positionRoutes.get('/root', (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Fetching root positions...");
        const rootPos = yield index_js_1.db.select().from(schema_js_1.positions).where((0, drizzle_orm_1.isNull)(schema_js_1.positions.parentId)).execute();
        console.log("Root positions:", rootPos);
        if (!rootPos || rootPos.length === 0) {
            return c.json({ message: "No root position found" }, 404);
        }
        return c.json(rootPos, 200);
    }
    catch (error) {
        console.error("Error fetching root positions:", error);
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
}));
positionRoutes.get('/children/:id', (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = c.req.param('id');
        const children = yield index_js_1.db.select().from(schema_js_1.positions).where((0, drizzle_orm_1.eq)(schema_js_1.positions.parentId, id));
        if (!children.length) {
            return c.json({ message: "This position has no subordinate" });
        }
        return c.json(children, 200);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return c.json({ error: error.errors.map(e => e.message).join(", ") }, 400);
        }
        if (error.constraint) {
            return c.json({ error: error.constraint }, 400);
        }
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
}));
positionRoutes.get("/:id", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = c.req.param("id");
        const position = yield index_js_1.db.select().from(schema_js_1.positions).where((0, drizzle_orm_1.eq)(schema_js_1.positions.id, id));
        if (!position.length) {
            throw new http_exception_1.HTTPException(404, {});
        }
        return c.json(position[0]);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return c.json({ error: error.errors }, 400);
        }
        if (error.constraint) {
            return c.json({ error: error.constraint }, 400);
        }
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
}));
positionRoutes.delete('/:id', (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = c.req.param('id');
        const hasChildren = yield index_js_1.db.select().from(schema_js_1.positions).where((0, drizzle_orm_1.eq)(schema_js_1.positions.parentId, id));
        if (hasChildren.length > 0) {
            return c.json({ error: "Position with subordinate can't be deleted" }, 400);
        }
        const positionToDelete = yield index_js_1.db.select().from(schema_js_1.positions).where((0, drizzle_orm_1.eq)(schema_js_1.positions.id, id));
        if (!positionToDelete.length) {
            return c.json({ error: "Position not found" }, 404);
        }
        const deletedPosition = yield index_js_1.db.delete(schema_js_1.positions).where((0, drizzle_orm_1.eq)(schema_js_1.positions.id, id));
        if (deletedPosition.rowCount === 0) {
            return c.json({ error: "Position not found" }, 404);
        }
        return c.json(positionToDelete[0]);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return c.json({ error: error.errors }, 400);
        }
        if (error.constraint) {
            return c.json({ error: error.constraint }, 400);
        }
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
}));
positionRoutes.put('/:id', (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = c.req.param('id');
        const body = yield c.req.json();
        if (body.parentId === "none" || body.parentId === null || body.parentId === "") {
            body.parentId = null;
        }
        const validParents = yield index_js_1.db
            .select()
            .from(schema_js_1.positions)
            .where((0, drizzle_orm_1.not)((0, drizzle_orm_1.eq)(schema_js_1.positions.id, id))) // Exclude self
            .then((allPositions) => {
            const findDescendants = (id, positionsList) => {
                const children = positionsList.filter(pos => pos.parentId === id);
                let descendants = children.map(child => child.id);
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
        const validBody = position_schema_js_1.default.partial().parse(body);
        const updatedPosition = yield index_js_1.db.update(schema_js_1.positions).set(validBody).where((0, drizzle_orm_1.eq)(schema_js_1.positions.id, id)).returning();
        if (!updatedPosition || updatedPosition.length === 0) {
            return c.json({ error: "Position not found" }, 404);
        }
        return c.json(updatedPosition[0]);
    }
    catch (error) {
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
}));
positionRoutes.get('/validParent/:id', (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const positionId = c.req.param("id");
        const allPositions = yield index_js_1.db.select().from(schema_js_1.positions);
        const findDescendants = (id, positionsList) => {
            const children = positionsList.filter(pos => pos.parentId === id);
            let descendants = children.map(child => child.id);
            for (const child of children) {
                descendants = descendants.concat(findDescendants(child.id, positionsList));
            }
            return descendants;
        };
        const descendants = findDescendants(positionId, allPositions);
        descendants.push(positionId);
        const validParents = allPositions.filter(pos => !descendants.includes(pos.id));
        return c.json(validParents);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return c.json({ error: error.errors.map(e => e.message).join(", ") }, 400);
        }
        if (error.constraint) {
            return c.json({ error: error.constraint }, 400);
        }
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
}));
exports.default = positionRoutes;
