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
exports.jwtAuth = void 0;
const jwt_1 = require("hono/jwt");
const http_exception_1 = require("hono/http-exception");
require("dotenv/config");
const jwtAuth = (c, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = c.req.header("Authorization");
        if (!token) {
            return c.json({ message: "Unauthorized: No token Provided" }, 401);
        }
        const secret = process.env.JWT_SECRET;
        const decoded = yield (0, jwt_1.verify)(token, secret);
        if (!decoded) {
            return c.json({ message: "Unauthorized: Invalid token" }, 401);
        }
        c.set("user", decoded);
        yield next();
    }
    catch (error) {
        console.error("JWT Authentication Error:", error);
        throw new http_exception_1.HTTPException(401, { message: "Unauthorized: Invalid or expired token" });
    }
});
exports.jwtAuth = jwtAuth;
