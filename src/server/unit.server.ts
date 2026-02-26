import type { Unit } from "@/domain/unit";
import { randomUUID } from "crypto";

let units: Unit[] = [
    {
        id: 'unit-001',
        propertyId: 'prop-001',
        unitNumber: '101',
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 950,
        rent: 1350,
        status: 'occupied',
        createdAt: new Date('2024-01-20T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-06-10T09:30:00Z').toISOString(),
    },
    {
        id: 'unit-002',
        propertyId: 'prop-001',
        unitNumber: '102',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 750,
        rent: 1150,
        status: 'vacant',
        createdAt: new Date('2024-02-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-07-01T08:00:00Z').toISOString(),
    },
    {
        id: 'unit-003',
        propertyId: 'prop-001',
        unitNumber: '103',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1200,
        rent: 1650,
        status: 'occupied',
        createdAt: new Date('2024-03-10T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-06-15T11:45:00Z').toISOString(),
    },
    {
        id: 'unit-004',
        propertyId: 'prop-002',
        unitNumber: '104',
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 900,
        rent: 1300,
        status: 'occupied',
        createdAt: new Date('2024-01-25T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-06-20T14:20:00Z').toISOString(),
    },
    {
        id: 'unit-005',
        propertyId: 'prop-002',
        unitNumber: '105',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 700,
        rent: 1100,
        status: 'maintenance',
        createdAt: new Date('2024-04-05T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-07-05T09:15:00Z').toISOString(),
    }
]

export function getAllUnits(): Unit[] {
    return units;
}

export function getUnitsByPropertyId(propertyId: string): Unit[] {
    return units.filter(unit => unit.propertyId === propertyId);
}

export type CreateUnitInput = {
    propertyId: string;
    unitNumber: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet?: number;
    rent: number;
    status: Unit['status'];
}

export function createUnit(input: CreateUnitInput): Unit {
    const normalizedUnitNumber = input.unitNumber.trim().toLowerCase();
    const hasDuplicate = units.some(
        (u) => 
            u.propertyId === input.propertyId &&
            u.unitNumber.trim().toLowerCase() === normalizedUnitNumber,
    )

    if (hasDuplicate) {
        // This will bubble up through the server function to the client.
        // In a real app, you might use a custom error type.
        throw new Error(
            `A unit with number "${input.unitNumber.trim()}" already exists for this property.`
        );
    }

    const now = new Date().toISOString();

    const newUnit: Unit = {
        id: randomUUID(),
        propertyId: input.propertyId,
        unitNumber: input.unitNumber,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        squareFeet: input.squareFeet,
        rent: input.rent,
        status: input.status,
        createdAt: now,
        updatedAt: now,
    };

    units = [...units, newUnit];

    return newUnit;
}
