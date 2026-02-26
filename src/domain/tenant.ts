import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { tenants } from "@/db/schema";

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

const baseInsertTenantSchema = createInsertSchema(tenants);

export const createTenantSchema = baseInsertTenantSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		email: z
			.email("Invalid email address")
			.optional()
			.or(z.literal("").transform(() => undefined)),
		phone: z
			.string()
			.min(7, "Phone number must be at least 7 characters")
			.optional()
			.or(z.literal("").transform(() => undefined)),
	});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
