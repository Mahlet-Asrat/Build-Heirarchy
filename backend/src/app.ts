import { Env, Hono } from "hono";
import positionRoutes from "../routes/positions";
import {logger} from "hono/logger"
import { authRoutes } from "../routes/auth";
import {cors} from 'hono/cors'
import { companyRoutes } from "../routes/company";


const app =  new Hono<Env>()
.use('/*', cors())
.route('/positions', positionRoutes)
.route('/auth', authRoutes)
.route('/company-info', companyRoutes)


export type AppType = typeof app
export default app

