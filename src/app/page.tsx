"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetchBlocksBlocksGet } from "@/http/blocks/blocks";
import { useFetchLatestTransactionsTransactionsGet } from "@/http/transactions/transactions";

function formatTimestamp(timestamp: number) {
	const now = Date.now() / 1000;
	const diff = now - timestamp;

	if (diff < 60) return `${Math.floor(diff)} secs ago`;
	if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
	return `${Math.floor(diff / 86400)} days ago`;
}

function formatHash(hash: string, length = 10) {
	return `${hash.slice(0, length)}...${hash.slice(-6)}`;
}

function formatEther(wei: number) {
	return (wei / 1e18).toFixed(4);
}

export default function HomePage() {
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();

	// Fetch recent blocks with React Query
	const {
		data: blocksData,
		isLoading: blocksLoading,
		error: blocksError,
	} = useFetchBlocksBlocksGet({
		page: 1,
		per_page: 3,
	});

	// Fetch recent transactions with React Query
	const {
		data: transactionsData,
		isLoading: transactionsLoading,
		error: transactionsError,
	} = useFetchLatestTransactionsTransactionsGet({
		limit: 3,
	});

	const handleSearch = () => {
		if (!searchQuery.trim()) return;

		// Determine search type based on input
		if (searchQuery.startsWith("0x") && searchQuery.length === 42) {
			// Address
			router.push(`/address/${searchQuery}`);
		} else if (searchQuery.startsWith("0x") && searchQuery.length === 66) {
			// Transaction hash
			router.push(`/tx/${searchQuery}`);
		} else if (!Number.isNaN(Number(searchQuery))) {
			// Block number
			router.push(`/block/${searchQuery}`);
		} else {
			// Default to transaction search
			router.push(`/tx/${searchQuery}`);
		}
	};

	const recentBlocks = blocksData?.blocks || [];
	const recentTransactions = transactionsData || [];
	const latestBlock = recentBlocks[0];

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-blue-600">
								MiniEtherScan
							</h1>
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
				{/* Search Section */}
				<div className="mb-8">
					<div className="max-w-2xl mx-auto">
						<h2 className="text-3xl font-bold text-center mb-6">
							Ethereum Blockchain Explorer
						</h2>
						<div className="flex gap-2">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder="Search by Address / Txn Hash / Block / Token"
									className="pl-10 h-12"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSearch()}
								/>
							</div>
							<Button className="h-12 px-6" onClick={handleSearch}>
								Search
							</Button>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<Card>
						<CardContent className="p-6">
							<div className="text-2xl font-bold">
								{blocksLoading
									? "Loading..."
									: latestBlock?.number?.toLocaleString() || "N/A"}
							</div>
							<p className="text-sm text-muted-foreground">Latest Block</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="text-2xl font-bold">
								{transactionsLoading
									? "Loading..."
									: recentTransactions?.length
										? `${recentTransactions.length}+`
										: "N/A"}
							</div>
							<p className="text-sm text-muted-foreground">
								Recent Transactions
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="text-2xl font-bold">
								{blocksLoading
									? "Loading..."
									: latestBlock?.gas_used
										? `${(latestBlock.gas_used / 1e6).toFixed(2)}M`
										: "N/A"}
							</div>
							<p className="text-sm text-muted-foreground">Gas Used</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="text-2xl font-bold">
								{blocksLoading
									? "Loading..."
									: latestBlock?.base_fee_per_gas
										? `${(latestBlock.base_fee_per_gas / 1e9).toFixed(1)} Gwei`
										: "N/A"}
							</div>
							<p className="text-sm text-muted-foreground">Base Fee</p>
						</CardContent>
					</Card>
				</div>

				{/* Recent Blocks and Transactions */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Recent Blocks */}
					<Card>
						<CardHeader>
							<CardTitle>Latest Blocks</CardTitle>
							<CardDescription>
								Most recent blocks on the Ethereum blockchain
							</CardDescription>
						</CardHeader>
						<CardContent>
							{blocksLoading ? (
								<div className="text-center py-8">Loading blocks...</div>
							) : blocksError ? (
								<div className="text-center py-8 text-red-500">
									Error loading blocks
								</div>
							) : (
								<div className="space-y-4">
									{recentBlocks.map((block) => (
										<div
											key={block.number}
											className="flex items-center justify-between p-4 border rounded-lg"
										>
											<div className="flex items-center space-x-4">
												<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
													<div className="w-4 h-4 bg-blue-600 rounded"></div>
												</div>
												<div>
													<Link
														href={`/block/${block.number}`}
														className="font-medium text-blue-600 hover:underline"
													>
														{block.number.toLocaleString()}
													</Link>
													<div className="text-sm text-muted-foreground">
														{formatTimestamp(block.timestamp)}
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-sm font-medium">
													{block.transactions_hashes.length} txns
												</div>
												<div className="text-sm text-muted-foreground">
													Miner: {formatHash(block.miner, 6)}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Recent Transactions */}
					<Card>
						<CardHeader>
							<CardTitle>Latest Transactions</CardTitle>
							<CardDescription>
								Most recent transactions on the network
							</CardDescription>
						</CardHeader>
						<CardContent>
							{transactionsLoading ? (
								<div className="text-center py-8">Loading transactions...</div>
							) : transactionsError ? (
								<div className="text-center py-8 text-red-500">
									Error loading transactions
								</div>
							) : (
								<div className="space-y-4">
									{recentTransactions.map((tx) => (
										<div
											key={tx.transaction_hash}
											className="flex items-center justify-between p-4 border rounded-lg"
										>
											<div className="flex items-center space-x-4">
												<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
													<div className="w-4 h-4 bg-green-600 rounded"></div>
												</div>
												<div>
													<Link
														href={`/tx/${tx.transaction_hash}`}
														className="font-medium text-blue-600 hover:underline text-sm"
													>
														{formatHash(tx.transaction_hash)}
													</Link>
													<div className="text-sm text-muted-foreground">
														{formatTimestamp(tx.timestamp)}
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-sm font-medium">
													{formatEther(tx.value)} ETH
												</div>
												<div className="text-sm text-muted-foreground">
													Fee: {formatEther(tx.transaction_fee)} ETH
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
