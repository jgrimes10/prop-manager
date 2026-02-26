import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
	return (
		<main className="p-6 space-y-4">
			<section>
				<h1 className="text-2xl font-semibold">Property Manager - MVP</h1>
				<p className="mt-2 text-sm text-gray-600">
					Track your rental properties, units, tenants, and leases.
				</p>
			</section>

			<section className="space-y-2">
				<h2 className="text-sm font-semibold text-gray-700">Start managing</h2>
				<div className="flex flex-wrap gap-3">
					<Link
						to="/properties"
						className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
					>
						View Properties
					</Link>
				</div>
			</section>
		</main>
	);
}
