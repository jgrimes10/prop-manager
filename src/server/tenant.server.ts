import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { tenants } from "@/db/schema";
import type { CreateTenantInput, NewTenant, Tenant } from "@/domain/tenant";

/**
 * Retrieves all tenants from the database, ordered by their creation date in ascending order. Each tenant object includes all fields defined in the `Tenant` type. The function returns a promise that resolves to an array of tenant objects.
 * @returns {Promise<Tenant[]>} A promise that resolves to an array of tenants.
 */
export async function getAllTenants(): Promise<Tenant[]> {
	return db.select().from(tenants).orderBy(tenants.createdAt);
}

/**
 * Retrieves a tenant by their unique ID. If a tenant with the specified ID exists, it returns the tenant object; otherwise, it returns `undefined`.
 * @param {string} id - The unique identifier of the tenant to retrieve.
 * @returns {Promise<Tenant | undefined>} A promise that resolves to the tenant object if found, or `undefined` if no tenant with the specified ID exists.
 */
export async function getTenantById(id: string): Promise<Tenant | undefined> {
	const [row] = await db
		.select()
		.from(tenants)
		.where(eq(tenants.id, id))
		.limit(1);
	return row;
}

/**
 * Retrieves all tenants associated with a specific unit ID. The tenants are ordered by their creation date in ascending order.
 * @param {string} unitId - The ID of the unit for which to retrieve tenants.
 * @returns {Promise<Tenant[]>} A promise that resolves to an array of tenants.
 */
export async function getTenantsByUnitId(unitId: string): Promise<Tenant[]> {
	return db
		.select()
		.from(tenants)
		.where(eq(tenants.unitId, unitId))
		.orderBy(tenants.createdAt);
}

/**
 * Creates a new tenant with the provided input. The `firstName` and `lastName` fields are required and will be trimmed of whitespace. The `email` and `phone` fields are optional and will be trimmed if provided. The `moveInDate` and `moveOutDate` fields are optional and can be set to `null`. The function returns the newly created tenant record.
 * @param {CreateTenantInput} input - The input data for creating a tenant.
 * @returns {Promise<Tenant>} A promise that resolves to the newly created tenant.
 * @throws {Error} - Throws an error if the required fields are missing or if there is a database error.
 */
export async function createTenant(input: CreateTenantInput): Promise<Tenant> {
	const now = new Date();

	const newRow: NewTenant = {
		id: randomUUID(),
		unitId: input.unitId,
		firstName: input.firstName.trim(),
		lastName: input.lastName.trim(),
		email: input.email?.trim() ?? null,
		phone: input.phone?.trim() ?? null,
		moveInDate: input.moveInDate ?? null,
		moveOutDate: input.moveOutDate ?? null,
		createdAt: now,
		updatedAt: now,
	};

	const [inserted] = await db.insert(tenants).values(newRow).returning();
	return inserted;
}

/**
 * Updates a tenant by ID. Only the fields provided in the input will be updated. If a field is set to `undefined`, it will not be updated. If a field is set to `null`, it will be cleared in the database.
 * @param {string} id - The ID of the tenant to update.
 * @param {Partial<CreateTenantInput>} input - The fields to update.
 * @returns {Promise<Tenant | undefined>} A promise that resolves to the updated tenant, or `undefined` if the tenant was not found.
 */
export async function updateTenant(
	id: string,
	input: Partial<CreateTenantInput>,
): Promise<Tenant | undefined> {
	const now = new Date();

	const [updated] = await db
		.update(tenants)
		.set({
			...(input.firstName && { firstName: input.firstName.trim() }),
			...(input.lastName && { lastName: input.lastName.trim() }),
			...(input.email !== undefined && {
				email: input.email?.trim() ?? null,
			}),
			...(input.phone !== undefined && {
				phone: input.phone?.trim() ?? null,
			}),
			...(input.moveInDate !== undefined && {
				moveInDate: input.moveInDate,
			}),
			...(input.moveOutDate !== undefined && {
				moveOutDate: input.moveOutDate,
			}),
			updatedAt: now,
		})
		.where(eq(tenants.id, id))
		.returning();

	return updated;
}

/**
 * Deletes a tenant by ID. This will also cascade delete any related records due to the foreign key constraint.
 * @param {string} id - The ID of the tenant to delete.
 * @returns {Promise<void>} A promise that resolves when the tenant is deleted.
 */
export async function deleteTenant(id: string): Promise<void> {
	await db.delete(tenants).where(eq(tenants.id, id));
}
