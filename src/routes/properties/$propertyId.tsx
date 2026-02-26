import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import type { CreateUnitInput } from "@/domain/unit";
import { getProperty } from "@/server/property.functions";
import { createUnitFn, listUnitsForProperty } from "@/server/unit.functions";

export const Route = createFileRoute("/properties/$propertyId")({
	loader: async ({ params }) => {
		const propertyId = params.propertyId;

		const [property, units] = await Promise.all([
			getProperty({ data: propertyId }),
			listUnitsForProperty({ data: propertyId }),
		]);

		return { property, units };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { property, units } = Route.useLoaderData() as {
		property: Awaited<ReturnType<typeof getProperty>>;
		units: Awaited<ReturnType<typeof listUnitsForProperty>>;
	};

	return (
		<main className="p-6 space-y-4">
			<header className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold">{property.name}</h1>
					<p className="mt-1 text-sm text-gray-600">
						{property.addressLine1}
						{property.addressLine2 ? `, ${property.addressLine2}` : ""}
						{" . "}
						{property.city}, {property.state} {property.zipCode}
					</p>
				</div>

				<Link
					to="/properties"
					className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
				>
					← Back to Properties
				</Link>
			</header>

			{/* Stub section we will flesh out later */}
			<section className="grid gap-4 md:grid-cols-3">
				<div className="rounded-md border border-gray-200 bg-white p-4 md:col-span-2">
					<h2 className="text-sm font-semibold text-gray-700">
						Property overview
					</h2>
					<dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
						<div>
							<dt className="text-gray-500">Status</dt>
							<dd className="font-medium capitalize">{property.status}</dd>
						</div>
						<div>
							<dt className="text-gray-500">Country</dt>
							<dd className="font-medium">{property.country}</dd>
						</div>
						<div>
							<dt className="text-gray-500">Created</dt>
							<dd className="font-medium">
								{new Date(property.createdAt).toLocaleDateString()}
							</dd>
						</div>
						<div>
							<dt className="text-gray-500">Last Updated</dt>
							<dd className="font-medium">
								{new Date(property.updatedAt).toLocaleDateString()}
							</dd>
						</div>
					</dl>
				</div>

				<div className="rounded-md border border-gray-200 bg-white p-4">
					<h2 className="text-sm font-semibold text-gray-700">Quick Actions</h2>
					<ul className="mt-3 space-y-2 text-sm text-gray-500">
						<li>➕ Add unit (coming soon)</li>
						<li>📃 View leases (coming soon)</li>
						<li>👥 View tenants (coming soon)</li>
					</ul>
				</div>
			</section>

			<UnitsSection propertyId={property.id} units={units} />
		</main>
	);
}

type UnitsSectionProps = {
	propertyId: string;
	units: Awaited<ReturnType<typeof listUnitsForProperty>>;
};

function UnitsSection({ propertyId, units }: UnitsSectionProps) {
	const [isAddOpen, setIsAddOpen] = React.useState(false);

	return (
		<>
			<section className="rounded-md border border-gray-200 bg-white p-4">
				<div className="flex items-center justify-between gap-4">
					<h2 className="text-sm font-semibold text-gray-700">Units</h2>
					<button
						type="button"
						onClick={() => setIsAddOpen(true)}
						className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
					>
						+ Add Unit
					</button>
				</div>

				{units.length === 0 ? (
					<p className="mt-3 text-sm text-gray-500">
						No units are associated with this property yet.
					</p>
				) : (
					<div className="mt-3 overflow-x-auto">
						<table className="min-w-full text-left text-sm">
							<thead className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
								<tr>
									<th className="px-3 py-2">Unit</th>
									<th className="px-3 py-2">Beds / Baths</th>
									<th className="px-3 py-2">Sq Ft</th>
									<th className="px-3 py-2">Rent</th>
									<th className="px-3 py-2">Status</th>
								</tr>
							</thead>
							<tbody>
								{units.map((unit) => (
									<tr key={unit.id} className="border-t last:border-b">
										<td className="px-3 py-2 font-medium">{unit.unitNumber}</td>
										<td className="px-3 py-2">
											{unit.bedrooms} bd / {unit.bathrooms} ba
										</td>
										<td className="px-3 py-2">
											{unit.squareFeet
												? `${unit.squareFeet.toLocaleString()} sq ft`
												: "—"}
										</td>
										<td className="px-3 py-2">${unit.rent.toLocaleString()}</td>
										<td className="px-3 py-2">
											<UnitStatusPill status={unit.status} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>

			<AddUnitModal
				isOpen={isAddOpen}
				onClose={() => setIsAddOpen(false)}
				propertyId={propertyId}
			/>
		</>
	);
}

type UnitStatus = "vacant" | "occupied" | "notice" | "maintenance";

function UnitStatusPill({ status }: { status: UnitStatus }) {
	const label =
		status === "vacant"
			? "Vacant"
			: status === "occupied"
				? "Occupied"
				: status === "notice"
					? "Notice Given"
					: "Maintenance";

	const colorClasses =
		status === "vacant"
			? "bg-yellow-100 text-yellow-700"
			: status === "occupied"
				? "bg-green-100 text-green-700"
				: status === "notice"
					? "bg-orange-100 text-orange-700"
					: "bg-blue-100 text-blue-700";

	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}
		>
			{label}
		</span>
	);
}

type AddUnitModalProps = {
	isOpen: boolean;
	onClose: () => void;
	propertyId: string;
};

function AddUnitModal({ isOpen, onClose, propertyId }: AddUnitModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Add Unit"
			description="Create a new unit for this property."
			size="sm"
		>
			<AddUnitForm propertyId={propertyId} onSuccess={onClose} />
		</Modal>
	);
}

type AddUnitFormProps = {
	propertyId: string;
	onSuccess: () => void;
};

function AddUnitForm({ propertyId, onSuccess }: AddUnitFormProps) {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { isSubmitting, errors },
	} = useForm<CreateUnitInput>({
		defaultValues: {
			propertyId,
			unitNumber: "",
			bedrooms: 1,
			bathrooms: 1,
			squareFeet: undefined,
			rent: 1000,
			status: "vacant",
		},
	});

	const onSubmit = handleSubmit(async (values) => {
		try {
			clearErrors("unitNumber");

			await createUnitFn({
				data: {
					...values,
					propertyId,
				},
			});

			// Refresh current route loaders so the new unit appears.
			await router.invalidate({ sync: true });
			reset({ ...values, unitNumber: "", squareFeet: undefined });

			onSuccess?.();
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "Could not create unit. Please try again.";

			// Set the error on unitNumber since that's what the rule is about.
			setError("unitNumber", {
				type: "server",
				message,
			});
		}
	});

	return (
		<form onSubmit={onSubmit} className="mt-3 space-y-3 text-sm">
			<div>
				<label
					className="block text-xs font-medium text-gray-700"
					htmlFor="unitNumber"
				>
					Unit Number
				</label>
				<input
					id="unitNumber"
					type="text"
					className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
					{...register("unitNumber", { required: "Unit number is required" })}
				/>
				{errors.unitNumber && (
					<p className="mt-1 text-xs text-red-600">
						{errors.unitNumber.message}
					</p>
				)}
			</div>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						className="block text-xs font-medium text-gray-700"
						htmlFor="bedrooms"
					>
						Bedrooms
					</label>
					<input
						id="bedrooms"
						type="number"
						className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
						{...register("bedrooms", {
							valueAsNumber: true,
							min: { value: 0, message: "Must be 0 or more" },
							required: "Bedrooms is required",
						})}
					/>
					{errors.bedrooms && (
						<p className="mt-1 text-xs text-red-600">
							{errors.bedrooms.message}
						</p>
					)}
				</div>

				<div>
					<label
						className="block text-xs font-medium text-gray-700"
						htmlFor="bathrooms"
					>
						Bathrooms
					</label>
					<input
						id="bathrooms"
						type="number"
						step="0.5"
						className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
						{...register("bathrooms", {
							valueAsNumber: true,
							min: { value: 0, message: "Must be 0 or more" },
							required: "Bathrooms is required",
						})}
					/>
					{errors.bathrooms && (
						<p className="mt-1 text-xs text-red-600">
							{errors.bathrooms.message}
						</p>
					)}
				</div>
			</div>

			<div>
				<label
					className="block text-xs font-medium text-gray-700"
					htmlFor="sqft"
				>
					Square Feet (optional)
				</label>
				<input
					id="sqft"
					type="number"
					className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
					{...register("squareFeet", {
						valueAsNumber: true,
						min: { value: 0, message: "Must be 0 or more" },
					})}
				/>
				{errors.squareFeet && (
					<p className="mt-1 text-xs text-red-600">
						{errors.squareFeet.message}
					</p>
				)}
			</div>

			<div>
				<label
					className="block text-xs font-medium text-gray-700"
					htmlFor="rent"
				>
					Monthly Rent
				</label>
				<input
					id="rent"
					type="number"
					className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
					{...register("rent", {
						valueAsNumber: true,
						min: { value: 0, message: "Must be 0 or more" },
						required: "Rent is required",
					})}
				/>
				{errors.rent && (
					<p className="mt-1 text-xs text-red-600">{errors.rent.message}</p>
				)}
			</div>

			<div>
				<label
					className="block text-xs font-medium text-gray-700"
					htmlFor="status"
				>
					Status
				</label>
				<select
					id="status"
					className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
					{...register("status", { required: true })}
				>
					<option value="vacant">Vacant</option>
					<option value="occupied">Occupied</option>
					<option value="notice">Notice Given</option>
					<option value="maintenance">Maintenance</option>
				</select>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-70"
			>
				{isSubmitting ? "Saving…" : "Save Unit"}
			</button>
		</form>
	);
}
