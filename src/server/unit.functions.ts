import { createServerFn } from "@tanstack/react-start";
import { createUnit, getUnitsByPropertyId, type CreateUnitInput } from "./unit.server";

export const listUnitsForProperty = createServerFn()
    .inputValidator((propertyId: string) => propertyId)
    .handler(async ({ data: propertyId }) => {
        // Returns [] if there are no units, which is fine.
        return getUnitsByPropertyId(propertyId);
    });

export const createUnitFn = createServerFn()
    .inputValidator((input: CreateUnitInput) => input)
    .handler(async ({ data }) => {
        // In the future this will be a DB call
        const unit = createUnit(data);
        return unit;
    })
