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
exports.authRoutes = void 0;
const hono_1 = require("hono");
const db_1 = require("../src/db");
const schema_1 = require("../src/db/schema");
const bcryptjs_1 = require("bcryptjs");
const drizzle_orm_1 = require("drizzle-orm");
const http_exception_1 = require("hono/http-exception");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const signup_schema_1 = __importDefault(require("./dto/signup.schema"));
const login_schema_1 = __importDefault(require("./dto/login.schema"));
const zod_1 = require("zod");
exports.authRoutes = new hono_1.Hono();
exports.authRoutes.post('/signup', (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield c.req.json();
        const validatedUser = signup_schema_1.default.parse(body);
        const { name, email, password, description } = validatedUser;
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        const [newUser] = yield db_1.db.insert(schema_1.company).values({
            name,
            email,
            password: hashedPassword,
            description: description || null
        }).returning();
        return c.json(newUser, 201);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return c.json({ validationErrors: error.format() }, 400);
        }
        if (error.constraint === "User with this email already exists.") {
            return c.json({ error: "Email is already in use." }, 409);
        }
        if (error instanceof http_exception_1.HTTPException) {
            return c.json({ error: error.message }, error.status);
        }
        console.error("Unexpected Signup Error:", error);
        return c.json({ error: "Something went wrong. Please try again later." }, 500);
    }
}));
exports.authRoutes.post('/login', (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield c.req.json();
        const validatedUser = login_schema_1.default.parse(body);
        const { email, password } = validatedUser;
        const user = yield db_1.db.select().from(schema_1.company).where((0, drizzle_orm_1.eq)(schema_1.company.email, email));
        if (!user.length) {
            return c.json({ error: "Invalid email or password." }, 401);
        }
        const userPassword = user[0].password;
        const isValid = yield (0, bcryptjs_1.compare)(password, userPassword);
        if (!isValid) {
            return c.json({ error: "Wrong Password." }, 401);
        }
        const token = jsonwebtoken_1.default.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return c.json({ token }, 200);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return c.json({ error: "Validation failed.", details: error.format() }, 400);
        }
        return c.json({ error: error.message || "Something went wrong. Please try again later." }, error.status || 500);
    }
}));
