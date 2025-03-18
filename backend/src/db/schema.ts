import { sql } from "drizzle-orm";
import { pgTable , uuid, text} from "drizzle-orm/pg-core";


export const positions: any = pgTable( "positions", {
    id: uuid('id').defaultRandom().primaryKey(),  
    name: text('name').unique("Position already exists"), 
    description: text('description'),
    parentId: uuid('parent_id').references(() => positions.id, {onDelete: 'restrict'}),
    companyId: uuid('companyId').references(() => company.id, {onDelete: "cascade"})
})


export const company = pgTable('company', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name'),
    description: text('description'),
    email: text('email').unique("User with this email already exists."),
    password: text('password')
})