import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import {
	type CreatePropertyInput,
	createPropertySchema,
} from "@/domain/property";
import { createPropertyFn, listProperties } from "@/server/property.functions";

export const Route = createFileRoute("/properties/")({
	loader: () => listProperties(),
	component: PropertiesPage,
});

function PropertiesPage() {
	const { items: properties = [] } = Route.useLoaderData();
	const [isAddOpen, setIsAddOpen] = useState(false);

	return (
		<main className="p-6 space-y-4">
			<header className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold">Properties</h1>
					<p className="mt-1 text-sm text-gray-600">
						Overview of your managed rental properties.
					</p>
				</div>

				{/* Placeholder for 'Add Property' we'll implement later */}
				<button
					type="button"
					onClick={() => setIsAddOpen(true)}
					className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
				>
					+ Add Property
				</button>
			</header>

			<section className="overflow-x-auto rounded-md border border-gray-200 bg-white">
				<table className="min-w-full text-left text-sm">
					<thead className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
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
							<tr key={property.id} className="border-t last:border-b">
								<td className="px-4 py-2 font-medium">
									{/* Detail route will exist soon; for now it's a stub link */}
									<Link
										to="/properties/$propertyId"
										params={{ propertyId: property.id }}
										className="text-blue-600 hover:underline"
									>
										{property.name}
									</Link>
								</td>
								<td className="px-4 py-2">
									{property.addressLine1}
									{property.addressLine2 ? `, ${property.addressLine2}` : ""}
								</td>
								<td className="px-4 py-2">
									{property.city}, {property.state} {property.zipCode}
								</td>
								<td className="px-4 py-2">
									<StatusPill status={property.status} />
								</td>
								<td className="px-4 py-2 text-right text-xs text-gray-500">
									{/* Placeholder for quick actions */}
									View - Edit - Units
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>

			<AddPropertyModal
				isOpen={isAddOpen}
				onClose={() => setIsAddOpen(false)}
			/>
		</main>
	);
}

interface StatusPillProps {
	status: "active" | "inactive" | "draft";
}

function StatusPill({ status }: StatusPillProps) {
	const label =
		status === "active"
			? "Active"
			: status === "inactive"
				? "Inactive"
				: "Draft";

	const colorClasses =
		status === "active"
			? "bg-green-100 text-green-700"
			: status === "inactive"
				? "bg-gray-100 text-gray-600"
				: "bg-yellow-100 text-yellow-700";

	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}
		>
			{label}
		</span>
	);
}

type AddPropertyModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Add Property"
			description="Enter basic information about the rental property."
			size="md"
		>
			<AddPropertyForm onSuccess={onClose} />
		</Modal>
	);
}

type AddPropertyFormProps = {
	onSuccess?: () => void;
};

function AddPropertyForm({ onSuccess }: AddPropertyFormProps) {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { isSubmitting, errors },
	} = useForm<CreatePropertyInput>({
		resolver: zodResolver(createPropertySchema),
		defaultValues: {
			name: "",
			addressLine1: "",
			addressLine2: "",
			city: "",
			state: "",
			zipCode: "",
			country: "USA",
			status: "active",
		},
	});

	React.useEffect(() => {
		// Focus name field when the form mounts
		// (React Hook Form's setFocus is another option;
		// here we'll just rely on default browser behavior if you add autoFocus)
	}, []);

	const onSubmit = handleSubmit(async (values) => {
		try {
			await createPropertyFn({
				data: values,
			});

			await router.invalidate({ sync: true });
			reset();

			onSuccess?.();
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "Could not create property. Please try again.";

			// Show the error under the 'name' field.
			setError("name", {
				type: "server",
				message,
			});
		}
	});

	return (
		<form onSubmit={onSubmit} className="space-y-3 text-sm">
			<div>
				<label
					htmlFor="name"
					className="block text-xs font-medium text-gray-700"
				>
					Property Name
				</label>
				<input
					id="name"
					type="text"
					className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
					{...register("name", { required: "Property name is required" })}
				/>
				{errors.name && (
					<p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="addressLine1"
					className="block text-xs font-medium text-gray-700"
				>
					Address Line 1
				</label>
				<input
					id="addressLine1"
					type="text"
					className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
					{...register("addressLine1", {
						required: "Address line 1 is required",
					})}
				/>
				{errors.addressLine1 && (
					<p className="mt-1 text-xs text-red-600">
						{errors.addressLine1.message}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="addressLine2"
					className="block text-xs font-medium text-gray-700"
				>
					Address Line 2 (optional)
				</label>
				<input
					id="addressLine2"
					type="text"
					className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
					{...register("addressLine2")}
				/>
			</div>

			<div className="grid gap-3 md:grid-cols-3">
				<div>
					<label
						htmlFor="city"
						className="block text-xs font-medium text-gray-700"
					>
						City
					</label>
					<input
						id="city"
						type="text"
						className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
						{...register("city", { required: "City is required" })}
					/>
					{errors.city && (
						<p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="state"
						className="block text-xs font-medium text-gray-700"
					>
						State / Region
					</label>
					<input
						id="state"
						type="text"
						className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
						{...register("state", { required: "State is required" })}
					/>
					{errors.state && (
						<p className="mt-1 text-xs text-red-600">{errors.state.message}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="zipCode"
						className="block text-xs font-medium text-gray-700"
					>
						Postal Code
					</label>
					<input
						id="zipCode"
						type="text"
						className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
						{...register("zipCode", {
							required: "Zip code is required",
						})}
					/>
					{errors.zipCode && (
						<p className="mt-1 text-xs text-red-600">
							{errors.zipCode.message}
						</p>
					)}
				</div>
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				<div>
					<label
						htmlFor="country"
						className="block text-xs font-medium text-gray-700"
					>
						Country
					</label>
					<input
						id="country"
						type="text"
						className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
						{...register("country", { required: "Country is required" })}
					/>
					{errors.country && (
						<p className="mt-1 text-xs text-red-600">
							{errors.country.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="status"
						className="block text-xs font-medium text-gray-700"
					>
						Status
					</label>
					<select
						id="status"
						className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
						{...register("status", { required: true })}
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
						<option value="draft">Draft</option>
					</select>
				</div>
			</div>

			<div className="flex items-center justify-end gap-2 pt-2">
				<button
					type="button"
					onClick={onSuccess}
					className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-70"
				>
					{isSubmitting ? "Saving…" : "Save Property"}
				</button>
			</div>
		</form>
	);
}
