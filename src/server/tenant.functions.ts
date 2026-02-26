import { createServerFn } from "@tanstack/react-start";
import { type CreateTenantInput, createTenantSchema } from "@/domain/tenant";
import { createTenant, getTenantsByUnitId } from "./tenant.server";

/**
 * Server function to retrieve tenants for a specific unit. It validates the input unit ID and then calls the `getTenantsByUnitId` function to fetch the tenants associated with that unit from the database. The function returns an array of tenant records.
 */
export const listTenantsForUnit = createServerFn({ method: "GET" })
	.inputValidator((unitId: string) => unitId)
	.handler(async ({ data: unitId }) => {
		const tenants = await getTenantsByUnitId(unitId);
		return { items: tenants };
	});

// Backward-compatible alias (can remove once the UI uses the new name)
export const getTenantForUnit = listTenantsForUnit;

/**
 * Server function to create a new tenant. It validates the input using the `createTenantSchema` and then calls the `createTenant` function to insert the new tenant into the database. The function returns the newly created tenant record.
 */
export const createTenantFn = createServerFn({ method: "POST" })
	.inputValidator((input: CreateTenantInput) => createTenantSchema.parse(input))
	.handler(async ({ data }) => {
		return await createTenant(data);
	});
