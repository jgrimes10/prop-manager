import { createServerFn } from "@tanstack/react-start";
import { type CreateUnitInput, createUnitSchema } from "@/domain/unit";
import { createUnit, getUnitsByPropertyId } from "./unit.server";

export const listUnitsForProperty = createServerFn()
	.inputValidator((propertyId: string) => propertyId)
	.handler(async ({ data: propertyId }) => {
		// Returns [] if there are no units, which is fine.
		return await getUnitsByPropertyId(propertyId);
	});

export const createUnitFn = createServerFn()
	.inputValidator((input: CreateUnitInput) => createUnitSchema.parse(input))
	.handler(async ({ data }) => {
		return await createUnit(data);
	});
