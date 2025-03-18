"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.company = exports.positions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.positions = (0, pg_core_1.pgTable)("positions", {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').unique("Position already exists"),
    description: (0, pg_core_1.text)('description'),
    parentId: (0, pg_core_1.uuid)('parent_id').references(() => exports.positions.id, { onDelete: 'restrict' }),
    companyId: (0, pg_core_1.uuid)('companyId').references(() => exports.company.id, { onDelete: "cascade" })
});
exports.company = (0, pg_core_1.pgTable)('company', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name'),
    description: (0, pg_core_1.text)('description'),
    email: (0, pg_core_1.text)('email').unique("User with this email already exists."),
    password: (0, pg_core_1.text)('password')
});
