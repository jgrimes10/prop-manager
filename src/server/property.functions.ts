import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	type CreatePropertyInput,
	createPropertySchema,
} from "@/domain/property";
import {
	createProperty,
	getAllProperties,
	getPropertyById,
} from "./property.server";

/**
 * Server function to list all properties. This function is designed to be used as an API endpoint that returns a list of all property objects. It currently returns a static list of properties, but it is structured to allow for asynchronous operations in the future, such as fetching data from a database.
 */
export const listProperties = createServerFn({ method: "GET" }).handler(
	async () => {
		const properties = await getAllProperties();
		return { items: properties };
	},
);

/**
 * Server function to get a specific property by its ID. This function takes a property ID as input, validates it, and returns the corresponding property object if found. If the property is not found, it throws a 404 Not Found error. This function is designed to be used as an API endpoint for retrieving individual property details.
 */
export const getProperty = createServerFn({ method: "GET" })
	.inputValidator((id: string) => id) // keep it simple for now
	.handler(async ({ data: id }) => {
		const property = await getPropertyById(id);

		if (!property) {
			throw notFound();
		}

		return property;
	});

/**
 * Server function to create a new property. This function takes a CreatePropertyInput object as input, validates it, and creates a new property using the createProperty function. It returns the newly created property object. This function is designed to be used as an API endpoint for creating new properties in the system.
 */
export const createPropertyFn = createServerFn({ method: "POST" })
	.inputValidator((input: CreatePropertyInput) =>
		createPropertySchema.parse(input),
	)
	.handler(async ({ data }) => {
		const property = await createProperty(data);
		return property;
	});
