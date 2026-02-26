import { createServerFn } from "@tanstack/react-start";
import { getAllProperties, getPropertyById } from "./property.server";
import { notFound } from "@tanstack/react-router";

export const listProperties = createServerFn().handler(async () => {
    // This could be async later (DB call), but we keep the signature
    // so callers already work with Promise-like behavior.
    return getAllProperties();
});

export const getProperty = createServerFn()
    .inputValidator((id: string) => id) // keep it simple for now
    .handler(async ({ data: id }) => {
        const property = getPropertyById(id);

        if (!property) {
            throw notFound();
        }

        return property;
    })
