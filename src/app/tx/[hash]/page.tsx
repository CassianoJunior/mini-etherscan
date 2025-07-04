"use client";

import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useGetTransactionByHashTransactionsTransactionHashGet } from "@/http/transactions/transactions";

// Helper to format USD
function formatUSD(amount: number | string) {
	if (amount === undefined || amount === null || Number.isNaN(Number(amount)))
		return "-";
	return `$${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatEther(wei: number) {
	return (wei / 1e18).toFixed(18);
}

function formatGwei(wei: number) {
	return (wei / 1e9).toFixed(2);
}

function formatTimestamp(timestamp: number) {
	return new Date(timestamp * 1000).toLocaleString();
}

export default function TransactionPage({
	params,
}: {
	params: { hash: string };
}) {
	const {
		data: transactionData,
		isLoading,
		error,
	} = useGetTransactionByHashTransactionsTransactionHashGet(params.hash);

	// Helper to check if this transaction is a swap (has swap_details)
	const isSwap =
		transactionData?.swap_details !== null &&
		transactionData?.swap_details !== undefined;

	// Helper to check if this transaction is part of a MEV attack (attacker/victim)
	// For this mock, we assume if swap_details.dex_name exists, it's a DEX swap, but we don't have MEV context here.
	// In a real app, this would come from block-level MEV analysis.
	// We'll show a warning if swap_details exists, and display the swap details.

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-lg">Loading transaction...</p>
				</div>
			</div>
		);
	}

	if (error || !transactionData) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-blue-600">BlockScan</h1>
							<nav className="hidden md:flex space-x-6">
								<Link
									href="/"
									className="text-sm font-medium hover:text-blue-600"
								>
									Home
								</Link>
							</nav>
						</div>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				{/* Back Button */}
				<div className="mb-6">
					<Link href="/">
						<Button variant="ghost" className="gap-2">
							<ArrowLeft className="w-4 h-4" />
							Back to Home
						</Button>
					</Link>
				</div>

				{/* Transaction Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Transaction Details</h1>
					<p className="text-muted-foreground">
						Information about this transaction
					</p>
				</div>

				{/* Transaction Status */}
				<Card className="mb-8">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
									<div className="w-6 h-6 bg-green-600 rounded"></div>
								</div>
								<div>
									<h2 className="text-xl font-semibold">Transaction Status</h2>
									<Badge
										variant="secondary"
										className="bg-green-100 text-green-800"
									>
										{transactionData.status}
									</Badge>
								</div>
							</div>
							<div className="text-right">
								<div className="text-sm text-muted-foreground">Block</div>
								<Link
									href={`/block/${transactionData.block_number}`}
									className="text-blue-600 hover:underline font-semibold"
								>
									{transactionData.block_number}
								</Link>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* SWAP/MEV Section */}
				{isSwap && (
					<Card className="mb-8 border-2 border-yellow-400">
						<CardHeader>
							<CardTitle>Swap Operation Detected</CardTitle>
							<CardDescription>
								This transaction includes a swap operation
								{transactionData.swap_details?.dex_name
									? ` on ${transactionData.swap_details.dex_name}`
									: ""}
								.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex flex-wrap gap-2 items-center">
									<Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
										Swap
									</Badge>
									{transactionData.swap_details?.dex_name && (
										<span className="text-sm text-muted-foreground">
											DEX: {transactionData.swap_details.dex_name}
										</span>
									)}
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<div className="text-sm font-medium text-muted-foreground">
											Token In
										</div>
										<div className="font-mono text-sm mt-1">
											{transactionData.swap_details?.token_in}
										</div>
									</div>
									<div>
										<div className="text-sm font-medium text-muted-foreground">
											Token Out
										</div>
										<div className="font-mono text-sm mt-1">
											{transactionData.swap_details?.token_out}
										</div>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<div className="text-sm font-medium text-muted-foreground">
											Amount In
										</div>
										<div className="font-mono text-sm mt-1">
											{transactionData.swap_details?.amount_in}
										</div>
									</div>
									<div>
										<div className="text-sm font-medium text-muted-foreground">
											Amount Out
										</div>
										<div className="font-mono text-sm mt-1">
											{transactionData.swap_details?.amount_out}
										</div>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<div className="text-sm font-medium text-muted-foreground">
											Gas Price
										</div>
										<div className="font-mono text-sm mt-1">
											{transactionData.swap_details?.gas_price}
										</div>
									</div>
									<div>
										<div className="text-sm font-medium text-muted-foreground">
											Swap Hash
										</div>
										<div className="font-mono text-sm mt-1">
											{transactionData.swap_details?.hash}
										</div>
									</div>
								</div>
								{/* MEV Attack Info (mocked, as we don't have block-level context here) */}
								<div className="mt-4">
									<Badge className="bg-orange-100 text-orange-800 border-orange-300">
										Potential MEV Attack
									</Badge>
									<div className="text-sm text-orange-700 mt-2">
										This swap may be part of a MEV attack (e.g., sandwich
										attack).
										<br />
										<span className="font-medium">Note:</span> For full MEV
										context, see the block page.
									</div>
									{/* Value and Cost (mocked, as we don't have cost/gain in transaction) */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
										<div>
											<div className="text-sm font-medium text-muted-foreground">
												Swap Value (WEI)
											</div>
											<div className="font-mono text-sm mt-1">
												{transactionData.value} WEI
											</div>
										</div>
										<div>
											<div className="text-sm font-medium text-muted-foreground">
												Transaction Fee (ETH)
											</div>
											<div className="font-mono text-sm mt-1">
												{transactionData.transaction_fee
													? formatEther(transactionData.transaction_fee)
													: "-"}{" "}
												ETH
											</div>
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
										<div>
											<div className="text-sm font-medium text-muted-foreground">
												Swap Value (USD)
											</div>
											<div className="font-mono text-sm mt-1">
												{transactionData.value
													? formatUSD(
															Number(formatEther(transactionData.value)) * 3500,
														)
													: "-"}
											</div>
										</div>
										<div>
											<div className="text-sm font-medium text-muted-foreground">
												Transaction Fee (USD)
											</div>
											<div className="font-mono text-sm mt-1">
												{transactionData.transaction_fee
													? formatUSD(
															Number(
																formatEther(transactionData.transaction_fee),
															) * 3500,
														)
													: "-"}
											</div>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Transaction Details */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Transaction Information</CardTitle>
						<CardDescription>
							Detailed information about this transaction
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{/* ...existing code... */}
							<div>
								<div className="text-sm font-medium text-muted-foreground">
									Transaction Hash
								</div>
								<div className="font-mono text-sm break-all flex items-center gap-2 mt-1">
									{transactionData.transaction_hash}
									<Button variant="ghost" size="icon" className="h-6 w-6">
										<Copy className="w-3 h-3" />
									</Button>
								</div>
							</div>
							{/* ...existing code... */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Status
									</div>
									<div className="mt-1">
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-800"
										>
											{transactionData.status}
										</Badge>
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Block
									</div>
									<div className="mt-1">
										<Link
											href={`/block/${transactionData.block_number}`}
											className="text-blue-600 hover:underline"
										>
											{transactionData.block_number}
										</Link>
									</div>
								</div>
							</div>
							{/* ...existing code... */}
							<div>
								<div className="text-sm font-medium text-muted-foreground">
									Timestamp
								</div>
								<div className="mt-1">
									{formatTimestamp(transactionData.timestamp)}
								</div>
							</div>
							{/* ...existing code... */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										From
									</div>
									<div className="font-mono text-sm break-all mt-1 flex items-center gap-2">
										{transactionData.from}
										<Button variant="ghost" size="icon" className="h-6 w-6">
											<ExternalLink className="w-3 h-3" />
										</Button>
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										To
									</div>
									<div className="font-mono text-sm break-all mt-1 flex items-center gap-2">
										{transactionData.to}
										<Button variant="ghost" size="icon" className="h-6 w-6">
											<ExternalLink className="w-3 h-3" />
										</Button>
									</div>
								</div>
							</div>
							{/* ...existing code... */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Value
									</div>
									<div className="text-xl font-semibold text-green-600 mt-1">
										{formatEther(transactionData.value)} ETH
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Transaction Fee
									</div>
									<div className="font-semibold mt-1">
										{formatEther(transactionData.transaction_fee)} ETH
									</div>
								</div>
							</div>
							{/* ...existing code... */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Gas Price
									</div>
									<div className="mt-1">
										{formatGwei(transactionData.gas_price)} Gwei
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Gas Limit
									</div>
									<div className="mt-1">
										{transactionData.gas.toLocaleString()}
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Gas Used
									</div>
									<div className="mt-1">
										{transactionData.gas.toLocaleString()} (100%)
									</div>
								</div>
							</div>
							{/* ...existing code... */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Nonce
									</div>
									<div className="mt-1">{transactionData.nonce}</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Position in Block
									</div>
									<div className="mt-1">
										{transactionData.transaction_index}
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Type
									</div>
									<div className="mt-1">Legacy</div>
								</div>
							</div>
							{/* ...existing code... */}
							<div>
								<div className="text-sm font-medium text-muted-foreground">
									Input Data
								</div>
								<div className="font-mono text-sm bg-muted p-3 rounded-md mt-1">
									{transactionData.input || "0x"}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
