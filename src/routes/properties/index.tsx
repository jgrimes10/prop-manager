import { listProperties } from '@/server/property.functions';
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/properties/')({
    loader: () => listProperties(),
    component: PropertiesPage,
})

function PropertiesPage() {
    const properties = (Route.useLoaderData() as
        | Awaited<ReturnType<typeof listProperties>>
        | undefined) ?? []

    return (
        <main className='p-6 space-y-4'>
            <header className='flex items-center justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-semibold'>Properties</h1>
                    <p className='mt-1 text-sm text-gray-600'>
                        Overview of your managed rental properties.
                    </p>
                </div>

                {/* Placeholder for 'Add Property' we'll implement later */}
                <button
                    type='button'
                    className='rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50'
                    disabled
                >
                    + Add Property (coming soon)
                </button>
            </header>

            <section className='overflow-x-auto rounded-md border border-gray-200 bg-white'>
                <table className='min-w-full text-left text-sm'>
                    <thead className='border-b bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Address</th>
                            <th className="px-4 py-2">City</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property) => (
                            <tr key={property.id} className='border-t last:border-b'>
                                <td className='px-4 py-2 font-medium'>
                                    {/* Detail route will exist soon; for now it's a stub link */}
                                    <Link to='/properties/$propertyId'
                                        params={{ propertyId: property.id }}
                                        className='text-blue-600 hover:underline'
                                    >
                                        {property.name}
                                    </Link>
                                </td>
                                <td className='px-4 py-2'>
                                    {property.addressLine1}
                                    {property.addressLine2 ? `, ${property.addressLine2}` : ''}
                                </td>
                                <td className='px-4 py-2'>
                                    {property.city}, {property.state} {property.zipCode}
                                </td>
                                <td className='px-4 py-2'>
                                    <StatusPill status={property.status} />
                                </td>
                                <td className='px-4 py-2 text-right text-xs text-gray-500'>
                                    {/* Placeholder for quick actions */}
                                    View - Edit - Units
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    )
}

interface StatusPillProps {
    status: 'active' | 'inactive' | 'draft';
}

function StatusPill({ status }: StatusPillProps) {
    const label =
        status === 'active'
        ? 'Active'
        : status === 'inactive'
        ? 'Inactive'
        : 'Draft';

    const colorClasses = 
        status === 'active'
        ? 'bg-green-100 text-green-700'
        : status === 'inactive'
        ? 'bg-gray-100 text-gray-600'
        : 'bg-yellow-100 text-yellow-700';
    
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}>
            {label}
        </span>
    )
}
