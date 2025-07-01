import { notFound } from "next/navigation"
import { BlockPageClient } from "./block-page"

// Server component that handles params and renders the client component
export default async function BlockPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const blockNumber = parseInt(id);

	if (Number.isNaN(blockNumber)) {
		notFound();
	}

	return <BlockPageClient blockNumber={blockNumber} />;
}
