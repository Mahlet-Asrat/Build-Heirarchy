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
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRoutes = void 0;
const hono_1 = require("hono");
const db_1 = require("../src/db");
const drizzle_orm_1 = require("drizzle-orm");
const jwtAuth_1 = require("../middleware/jwtAuth");
const schema_1 = require("../src/db/schema");
exports.companyRoutes = new hono_1.Hono();
exports.companyRoutes.use(jwtAuth_1.jwtAuth);
exports.companyRoutes.get("/", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = c.get("user");
        if (!user) {
            return c.json({ message: "Unauthorized" }, 401);
        }
        const userCompany = yield db_1.db.select().from(schema_1.company).where((0, drizzle_orm_1.eq)(schema_1.company.id, user.id));
        if (!userCompany.length) {
            return c.json({ message: "Company not found" }, 404);
        }
        const Availpositions = yield db_1.db.select().from(schema_1.positions).where((0, drizzle_orm_1.eq)(schema_1.positions.companyId, user.id));
        return c.json({
            company: { name: userCompany[0].name, email: userCompany[0].email, description: userCompany[0].description, },
            hasPositions: Availpositions.length > 0,
        });
    }
    catch (error) {
        console.error("Error fetching company info:", error);
        return c.json({ message: "Internal Server Error" }, 500);
    }
}));
