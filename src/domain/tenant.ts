import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { tenants } from "@/db/schema";

export const createTenantSchema = createInsertSchema(tenants).extend({
	email: z.email().optional(),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
