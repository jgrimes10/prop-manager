import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";
import { units } from "@/db/schema";

export const createUnitSchema = createInsertSchema(units).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;

export type Unit = typeof units.$inferSelect;
export type NewDbUnit = typeof units.$inferInsert;
