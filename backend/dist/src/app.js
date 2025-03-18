"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const positions_1 = __importDefault(require("../routes/positions"));
const auth_1 = require("../routes/auth");
const cors_1 = require("hono/cors");
const company_1 = require("../routes/company");
const app = new hono_1.Hono()
    .use('/*', (0, cors_1.cors)())
    .route('/positions', positions_1.default)
    .route('/auth', auth_1.authRoutes)
    .route('/company-info', company_1.companyRoutes);
exports.default = app;
