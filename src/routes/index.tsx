import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
    return (
        <main className='p-6'>
            <h1 className='text-2xl font-semibold'>
                Property Manager - MVP
            </h1>
            <p className='mt-2 text-sm text-gray-600'>
                Track your rental properties, units, tenants, and leases.
            </p>
        </main>
    )
}
