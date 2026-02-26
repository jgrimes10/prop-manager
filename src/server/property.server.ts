import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { properties } from "@/db/schema";
import type {
	CreatePropertyInput,
	NewDbProperty,
	Property,
} from "@/domain/property";

/**
 * Fetch all properties.
 * @returns {Promise<Property[]>} An array of all property objects.
 */
export async function getAllProperties(): Promise<Property[]> {
	return await db.select().from(properties).orderBy(properties.createdAt);
}

/**
 * Fetch a property by its ID.
 * @param {string} id - The unique identifier of the property to retrieve.
 * @returns {Property | undefined} The property object if found, otherwise undefined.
 */
export async function getPropertyById(
	id: string,
): Promise<Property | undefined> {
	const [row] = await db
		.select()
		.from(properties)
		.where(eq(properties.id, id))
		.limit(1);

	return row;
}

function isDuplicatePropertyError(error: unknown): boolean {
	return (
		error instanceof Error &&
		error.message.includes("UNIQUE constraint failed:") &&
		error.message.includes("properties_name_address_city_unique")
	);
}

/**
 * Create a new property based on the provided input. This function generates a unique ID for the property, sets the creation and update timestamps, and adds the new property to the in-memory list of properties.
 * @param {CreatePropertyInput} input - The input data for creating a new property.
 * @returns {Promise<Property>} The newly created property object.
 */
export async function createProperty(
	input: CreatePropertyInput,
): Promise<Property> {
	const newRow: NewDbProperty = {
		id: randomUUID(),
		name: input.name.trim(),
		addressLine1: input.addressLine1.trim(),
		addressLine2: input.addressLine2?.trim() || null,
		city: input.city.trim(),
		state: input.state.trim(),
		zipCode: input.zipCode.trim(),
		country: input.country.trim(),
		status: input.status,
	};

	try {
		const [inserted] = await db.insert(properties).values(newRow).returning();
		return inserted;
	} catch (error) {
		if (isDuplicatePropertyError(error)) {
			throw new Error(
				`A property named "${input.name.trim()}" at "${input.addressLine1.trim()}, ${input.city.trim()}" already exists.`,
			);
		}

		throw error;
	}
}
