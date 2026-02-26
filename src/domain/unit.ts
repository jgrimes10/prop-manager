export type UnitStatus = 'vacant' | 'occupied' | 'notice' | 'maintenance';

export interface Unit {
    id: string;
    propertyId: string;
    unitNumber: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet?: number;
    rent: number;
    status: UnitStatus;
    createdAt: string;
    updatedAt: string;
}
