import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { units } from "@/db/schema";
import type { CreateUnitInput, NewDbUnit, Unit } from "@/domain/unit";

/**
 * Retrieves all units across all properties.
 * @returns {Unit[]} An array of all units.
 */
export async function getAllUnits(): Promise<Unit[]> {
	return await db.select().from(units);
}

/**
 * Retrieves all units for a specific property by its ID.
 * @param {string} propertyId - The unique identifier of the property for which to retrieve units.
 * @returns {Unit[]} An array of units that belong to the specified property.
 */
export async function getUnitsByPropertyId(
	propertyId: string,
): Promise<Unit[]> {
	return await db
		.select()
		.from(units)
		.where(eq(units.propertyId, propertyId))
		.orderBy(units.unitNumber);
}

function isDuplicateUnitError(error: unknown): boolean {
	return (
		error instanceof Error &&
		error.message.includes("UNIQUE constraint failed:") &&
		error.message.includes("units_property_id_unit_number_unique")
	);
}

export async function createUnit(input: CreateUnitInput): Promise<Unit> {
	const newRow: NewDbUnit = {
		id: randomUUID(),
		propertyId: input.propertyId,
		unitNumber: input.unitNumber.trim(),
		bedrooms: input.bedrooms,
		bathrooms: input.bathrooms,
		squareFeet: input.squareFeet ?? null,
		rent: Math.round(input.rent),
		status: input.status,
	};

	try {
		const [inserted] = await db.insert(units).values(newRow).returning();
		return inserted;
	} catch (error) {
		if (isDuplicateUnitError(error)) {
			// Map the low-level DB constraint to a friendly domain error.
			throw new Error(
				`A unit with number "${input.unitNumber.trim()}" already exists for this property`,
			);
		}

		throw error;
	}
}
