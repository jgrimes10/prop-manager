import { createServerFn } from "@tanstack/react-start";
import { type CreateUnitInput, createUnitSchema } from "@/domain/unit";
import { createUnit, getUnitsByPropertyId } from "./unit.server";

export const listUnitsForProperty = createServerFn({ method: "GET" })
	.inputValidator((propertyId: string) => propertyId)
	.handler(async ({ data: propertyId }) => {
		// Returns [] if there are no units, which is fine.
		const units = await getUnitsByPropertyId(propertyId);
		return { items: units };
	});

export const createUnitFn = createServerFn({ method: "POST" })
	.inputValidator((input: CreateUnitInput) => createUnitSchema.parse(input))
	.handler(async ({ data }) => {
		return await createUnit(data);
	});
