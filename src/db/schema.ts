import { relations } from "drizzle-orm";
import {
	integer,
	real,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const properties = sqliteTable(
	"properties",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		addressLine1: text("address_line_1").notNull(),
		addressLine2: text("address_line_2"),
		city: text("city").notNull(),
		state: text("state").notNull(),
		zipCode: text("zip_code").notNull(),
		country: text("country").notNull(),
		status: text("status", {
			enum: ["active", "inactive", "draft"],
		}).notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => [
		uniqueIndex("properties_name_address_city_unique").on(
			table.name,
			table.addressLine1,
			table.city,
		),
	],
);

export const units = sqliteTable(
	"units",
	{
		id: text("id").primaryKey(),
		propertyId: text("property_id")
			.notNull()
			.references(() => properties.id, { onDelete: "cascade" }),
		unitNumber: text("unit_number").notNull(),
		bedrooms: integer("bedrooms").notNull(),
		bathrooms: real("bathrooms").notNull(),
		squareFeet: integer("square_feet"),
		rent: integer("rent").notNull(),
		status: text("status", {
			enum: ["vacant", "occupied", "maintenance", "notice"],
		}).notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => [
		uniqueIndex("units_property_id_unit_number_unique").on(
			table.propertyId,
			table.unitNumber,
		),
	],
);

export const tenants = sqliteTable("tenants", {
	id: text("id").primaryKey(),
	unitId: text("unit_id")
		.notNull()
		.references(() => units.id, { onDelete: "cascade" }),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email"),
	phone: text("phone"),
	moveInDate: integer("move_in_date", { mode: "timestamp" }),
	moveOutDate: integer("move_out_date", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const propertiesRelations = relations(properties, ({ many }) => ({
	units: many(units),
}));

export const unitsRelations = relations(units, ({ one }) => ({
	property: one(properties, {
		fields: [units.propertyId],
		references: [properties.id],
	}),
}));
