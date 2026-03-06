import { pgTable, varchar } from "drizzle-orm/pg-core";
import { globalId, globalTimestamps } from "../global";

export const categories = pgTable('categories', {
    ...globalId,

    title: varchar('title', { length: 255 }).notNull(),

    ...globalTimestamps
})