"use client";

import { ArrowLeft, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useGetAddressAddressAddressGet,
	useGetAddressAddressAddressTransactionsGet,
} from "@/http/address/address";

interface AddressPageProps {
	params: {
		address: string;
	};
}

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

function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text);
}

const tokens = [
	{
		name: "USD Coin",
		symbol: "USDC",
		balance: "1,250.00",
		value: "$1,250.00",
		contract: "0xa0b86a33e6776e681e9c6b1b6b6b6b6b6b6b6b6b",
	},
	{
		name: "Chainlink Token",
		symbol: "LINK",
		balance: "45.67",
		value: "$678.90",
		contract: "0x514910771af9ca656af840dff83e8264ecf986ca",
	},
];

export default function AddressPage({
	params,
}: {
	params: { address: string };
}) {
	const { address } = params;
	const [currentPage, _setCurrentPage] = useState(1);

	// Fetch address details - Note: The API doesn't return structured address data according to the schema
	// So we'll work with whatever is returned or show basic info
	const { isLoading: addressLoading, error: addressError } =
		useGetAddressAddressAddressGet(address);

	// Fetch address transactions
	const {
		data: transactionsData,
		isLoading: transactionsLoading,
		error: transactionsError,
	} = useGetAddressAddressAddressTransactionsGet(address, {
		page: currentPage,
		per_page: 10,
	});

	if (addressLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="text-lg">Loading address details...</div>
				</div>
			</div>
		);
	}

	if (addressError) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="text-lg text-red-500">
						Error loading address details
					</div>
					<div className="text-sm text-muted-foreground mt-2">
						{addressError.message || "Unknown error occurred"}
					</div>
				</div>
			</div>
		);
	}

	// Since the address endpoint doesn't return structured data, we'll work with transactions to derive info
	const transactions = Array.isArray(transactionsData) ? transactionsData : [];
	const transactionCount = transactions.length;

	// Calculate balance from transactions (this is simplified - in reality you'd get this from the API)
	const balance = transactions.reduce((acc, tx) => {
		if (
			typeof tx === "object" &&
			tx !== null &&
			"value" in tx &&
			"from" in tx &&
			"to" in tx
		) {
			const value = typeof tx.value === "number" ? tx.value : 0;
			const from = tx.from as string;
			const to = tx.to as string;

			if (from?.toLowerCase() === address.toLowerCase()) {
				return acc - value; // Outgoing transaction
			} else if (to?.toLowerCase() === address.toLowerCase()) {
				return acc + value; // Incoming transaction
			}
		}
		return acc;
	}, 0);
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
								<Link
									href="/blocks"
									className="text-sm font-medium hover:text-blue-600"
								>
									Blocks
								</Link>
								<Link
									href="/transactions"
									className="text-sm font-medium hover:text-blue-600"
								>
									Transactions
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

				{/* Address Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Address</h1>
					<div className="font-mono text-sm break-all flex items-center gap-2">
						{address}
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6"
							onClick={() => copyToClipboard(address)}
						>
							<Copy className="w-3 h-3" />
						</Button>
					</div>
				</div>

				{/* Address Overview */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
						<CardDescription>
							Address balance and activity summary
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div>
								<div className="text-sm font-medium text-muted-foreground mb-2">
									ETH Balance
								</div>
								<div className="text-2xl font-bold text-green-600">
									{formatEther(balance)} ETH
								</div>
								<div className="text-sm text-muted-foreground">~$0.00 USD</div>
							</div>
							<div>
								<div className="text-sm font-medium text-muted-foreground mb-2">
									Transactions
								</div>
								<div className="text-2xl font-bold">
									{transactionCount.toLocaleString()}
								</div>
							</div>
							<div>
								<div className="text-sm font-medium text-muted-foreground mb-2">
									First Seen
								</div>
								<div className="text-lg font-semibold">
									{transactions.length > 0 &&
									typeof transactions[transactions.length - 1] === "object" &&
									transactions[transactions.length - 1] !== null &&
									"timestamp" in transactions[transactions.length - 1]
										? new Date(
												(
													transactions[transactions.length - 1] as {
														timestamp: number;
													}
												).timestamp * 1000,
											).toLocaleDateString()
										: "N/A"}
								</div>
							</div>
							<div>
								<div className="text-sm font-medium text-muted-foreground mb-2">
									Last Seen
								</div>
								<div className="text-lg font-semibold">
									{transactions.length > 0 &&
									typeof transactions[0] === "object" &&
									transactions[0] !== null &&
									"timestamp" in transactions[0]
										? new Date(
												(transactions[0] as { timestamp: number }).timestamp *
													1000,
											).toLocaleDateString()
										: "N/A"}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Tabs for Transactions and Tokens */}
				<Tabs defaultValue="transactions" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="transactions">Transactions</TabsTrigger>
						<TabsTrigger value="tokens">Tokens</TabsTrigger>
					</TabsList>

					<TabsContent value="transactions">
						<Card>
							<CardHeader>
								<CardTitle>Transactions</CardTitle>
								<CardDescription>
									All transactions for this address
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Txn Hash</TableHead>
											<TableHead>Block</TableHead>
											<TableHead>Age</TableHead>
											<TableHead>From</TableHead>
											<TableHead>To</TableHead>
											<TableHead>Value</TableHead>
											<TableHead>Fee</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{transactionsLoading ? (
											<TableRow>
												<TableCell colSpan={7} className="text-center py-8">
													Loading transactions...
												</TableCell>
											</TableRow>
										) : transactionsError ? (
											<TableRow>
												<TableCell
													colSpan={7}
													className="text-center py-8 text-red-500"
												>
													Error loading transactions
												</TableCell>
											</TableRow>
										) : transactions.length === 0 ? (
											<TableRow>
												<TableCell colSpan={7} className="text-center py-8">
													No transactions found
												</TableCell>
											</TableRow>
										) : (
											transactions.map((tx) => {
												// Type guard to ensure tx is a valid transaction object
												if (
													!tx ||
													typeof tx !== "object" ||
													!("transaction_hash" in tx)
												) {
													return null;
												}

												const transaction = tx as {
													transaction_hash: string;
													block_number: number;
													timestamp: number;
													from: string;
													to: string;
													value: number;
													transaction_fee: number;
												};

												const isOutgoing =
													transaction.from?.toLowerCase() ===
													address.toLowerCase();

												return (
													<TableRow key={transaction.transaction_hash}>
														<TableCell>
															<Link
																href={`/tx/${transaction.transaction_hash}`}
																className="text-blue-600 hover:underline font-mono text-sm"
															>
																{formatHash(transaction.transaction_hash)}
															</Link>
														</TableCell>
														<TableCell>
															<Link
																href={`/block/${transaction.block_number}`}
																className="text-blue-600 hover:underline"
															>
																{transaction.block_number.toLocaleString()}
															</Link>
														</TableCell>
														<TableCell>
															{formatTimestamp(transaction.timestamp)}
														</TableCell>
														<TableCell className="font-mono text-sm">
															{formatHash(transaction.from, 8)}
															{isOutgoing && (
																<Badge
																	variant="destructive"
																	className="ml-2 text-xs"
																>
																	OUT
																</Badge>
															)}
														</TableCell>
														<TableCell className="font-mono text-sm">
															{formatHash(transaction.to, 8)}
															{!isOutgoing && (
																<Badge
																	variant="secondary"
																	className="ml-2 text-xs bg-green-100 text-green-800"
																>
																	IN
																</Badge>
															)}
														</TableCell>
														<TableCell className="font-semibold">
															{formatEther(transaction.value)} ETH
														</TableCell>
														<TableCell>
															{formatEther(transaction.transaction_fee)} ETH
														</TableCell>
													</TableRow>
												);
											})
										)}
									</TableBody>
								</Table>
								<div className="mt-4 text-center">
									<Button variant="outline">Load More Transactions</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="tokens">
						<Card>
							<CardHeader>
								<CardTitle>Token Holdings</CardTitle>
								<CardDescription>
									ERC-20 tokens held by this address
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Token</TableHead>
											<TableHead>Balance</TableHead>
											<TableHead>Value</TableHead>
											<TableHead>Contract</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{tokens.map((token) => (
											<TableRow key={token.contract}>
												<TableCell>
													<div>
														<div className="font-semibold">{token.name}</div>
														<div className="text-sm text-muted-foreground">
															{token.symbol}
														</div>
													</div>
												</TableCell>
												<TableCell className="font-semibold">
													{token.balance}
												</TableCell>
												<TableCell className="font-semibold text-green-600">
													{token.value}
												</TableCell>
												<TableCell className="font-mono text-sm">
													{token.contract.slice(0, 20)}...
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
