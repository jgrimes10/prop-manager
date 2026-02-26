import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";
import { properties } from "@/db/schema";

export const createPropertySchema = createInsertSchema(properties).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

export type Property = typeof properties.$inferSelect;
export type NewDbProperty = typeof properties.$inferInsert;
