import type { Property } from "@/domain/property";

const properties: Property[] = [
    {
        id: 'prop-001',
        name: 'Downtown Office Complex',
        addressLine1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
    },
    {
        id: 'prop-002',
        name: 'Suburban Retail Center',
        addressLine1: '456 Oak Avenue',
        addressLine2: 'Suite 200',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        status: 'active',
        createdAt: '2024-01-10T14:45:00Z',
        updatedAt: '2024-01-10T14:45:00Z',
    },
    {
        id: 'prop-003',
        name: 'Industrial Warehouse',
        addressLine1: '789 Industrial Boulevard',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        status: 'draft',
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-01-20T09:15:00Z',
    },
]

export function getAllProperties(): Property[] {
    return properties
}

export function getPropertyById(id: string): Property | undefined {
    return properties.find(p => p.id === id);
}
