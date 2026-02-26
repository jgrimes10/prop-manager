export type PropertyStatus = 'active' | 'inactive' | 'draft';

export interface Property {
    id: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    status: PropertyStatus;
    createdAt: string;
    updatedAt: string;
}
