"use client";

import {
	AlertTriangle,
	ArrowLeft,
	Copy,
	Search,
	Shield,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useFetchDetectMultiLayeredBurgerSandwichesByBlockNumberBlocksNumberMultipleSandwichGet,
	useFetchSandwichesAttackByBlockNumberBlocksNumberSandwichGet,
	useGetBlockByNumberBlocksNumberGet,
} from "@/http/blocks/blocks";

function formatTimestamp(timestamp: number) {
	return new Date(timestamp * 1000).toLocaleString();
}

function formatHash(hash: string, length = 10) {
	return `${hash.slice(0, length)}...${hash.slice(-6)}`;
}

function formatGwei(wei: number) {
	return (wei / 1e9).toFixed(2);
}

function formatBytes(bytes: number) {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

function formatTokenAmount(amount: string | number) {
	const num = typeof amount === "string" ? parseFloat(amount) : amount;
	if (num === 0) return "0";

	// For very small numbers, show in scientific notation
	if (num < 0.0001) {
		return num.toExponential(2);
	}

	// For normal numbers, show with appropriate decimal places
	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(2)}M`;
	} else if (num >= 1000) {
		return `${(num / 1000).toFixed(2)}K`;
	} else if (num >= 1) {
		return num.toFixed(4);
	} else {
		return num.toFixed(6);
	}
}

function getTokenSymbol(tokenAddress: string) {
	// Common token addresses and their symbols (you could expand this or fetch from an API)
	const tokenMap: { [key: string]: string } = {
		"0xa0b86a33e6441cc": "USDC",
		"0xdac17f958d2ee5": "USDT",
		"0x6b175474e8909": "DAI",
		"0xc02aaa39b223": "WETH",
		"0x2260fac5e5542": "WBTC",
	};

	const shortAddr = tokenAddress.toLowerCase().substring(0, 14);
	return tokenMap[shortAddr] || formatHash(tokenAddress, 4);
}

export function BlockPageClient({ blockNumber }: { blockNumber: number }) {
	// Fetch block details
	const {
		data: blockData,
		isLoading: blockLoading,
		error: blockError,
	} = useGetBlockByNumberBlocksNumberGet(blockNumber, {
		request: {
			params: {
				block_number: blockNumber,
			},
		},
	});

	// Fetch sandwich attack analysis
	const { data: sandwichData } =
		useFetchSandwichesAttackByBlockNumberBlocksNumberSandwichGet(blockNumber, {
			request: {
				params: {
					block_number: blockNumber,
				},
			},
		});

	// Fetch multi-layered sandwich analysis
	const { data: multipleSandwichData } =
		useFetchDetectMultiLayeredBurgerSandwichesByBlockNumberBlocksNumberMultipleSandwichGet(
			blockNumber,
			{
				request: {
					params: {
						block_number: blockNumber,
					},
				},
			},
		);

	if (blockLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-lg">Loading block...</p>
				</div>
			</div>
		);
	}

	if (blockError || !blockData) {
		notFound();
	}

	// Analyze MEV data
	const mevAnalysis = {
		hasSuspiciousActivity:
			(sandwichData && sandwichData.total_sandwiches > 0) ||
			(multipleSandwichData && multipleSandwichData.total_sandwiches > 0),
		sandwichAttacks: sandwichData?.sandwiches || [],
		multipleSandwichAttacks: multipleSandwichData?.sandwiches || [],
		totalSandwiches:
			(sandwichData?.total_sandwiches || 0) +
			(multipleSandwichData?.total_sandwiches || 0),
		riskLevel:
			(sandwichData?.total_sandwiches || 0) +
				(multipleSandwichData?.total_sandwiches || 0) >
			0
				? "High"
				: "Low",
	};

	// Helper function to collect all swap transaction hashes from MEV data
	const getSwapTransactionHashes = () => {
		const swapHashes = new Set<string>();

		// Collect hashes from single sandwich attacks
		if (sandwichData?.sandwiches) {
			sandwichData.sandwiches.forEach((sandwich) => {
				sandwich.swaps?.forEach((swap) => {
					if (swap.hash) {
						swapHashes.add(swap.hash);
					}
				});
			});
		}

		// Collect hashes from multiple sandwich attacks
		if (multipleSandwichData?.sandwiches) {
			multipleSandwichData.sandwiches.forEach((sandwich) => {
				// Handle front_run, victims, and back_run swaps
				const swaps = sandwich.swaps;
				if (swaps) {
					[...swaps.front_run, ...swaps.victims, ...swaps.back_run].forEach(
						(swap) => {
							if (swap.hash) {
								swapHashes.add(swap.hash);
							}
						},
					);
				}
			});
		}

		return swapHashes;
	};

	// Helper function to get detailed swap information for a specific transaction
	const getSwapDetails = (hash: string) => {
		// Check in single sandwich attacks
		if (sandwichData?.sandwiches) {
			for (const sandwich of sandwichData.sandwiches) {
				const swap = sandwich.swaps?.find((s) => s.hash === hash);
				if (swap) {
					return {
						type: "single",
						swap,
						attackGroupId: sandwich.attack_group_id,
						transition: swap.transition_type,
						tokenIn: swap.token_in,
						tokenOut: swap.token_out,
						amountIn: swap.amount_in,
						amountOut: swap.amount_out,
						gasPrice: swap.gas_price,
					};
				}
			}
		}

		// Check in multiple sandwich attacks
		if (multipleSandwichData?.sandwiches) {
			for (const sandwich of multipleSandwichData.sandwiches) {
				const swaps = sandwich.swaps;
				if (swaps) {
					// Check front_run swaps
					const frontRunSwap = swaps.front_run.find((s) => s.hash === hash);
					if (frontRunSwap) {
						return {
							type: "multiple",
							swap: frontRunSwap,
							attackerAddr: sandwich.attacker_addr,
							transition: "front_run",
							tokenIn: frontRunSwap.token_in,
							tokenOut: frontRunSwap.token_out,
							amountIn: frontRunSwap.amount_in,
							amountOut: frontRunSwap.amount_out,
							gasPrice: frontRunSwap.gas_price,
							dexName: frontRunSwap.dex_name,
						};
					}

					// Check victim swaps
					const victimSwap = swaps.victims.find((s) => s.hash === hash);
					if (victimSwap) {
						return {
							type: "multiple",
							swap: victimSwap,
							attackerAddr: sandwich.attacker_addr,
							transition: "victim",
							tokenIn: victimSwap.token_in,
							tokenOut: victimSwap.token_out,
							amountIn: victimSwap.amount_in,
							amountOut: victimSwap.amount_out,
							gasPrice: victimSwap.gas_price,
							dexName: victimSwap.dex_name,
						};
					}

					// Check back_run swaps
					const backRunSwap = swaps.back_run.find((s) => s.hash === hash);
					if (backRunSwap) {
						return {
							type: "multiple",
							swap: backRunSwap,
							attackerAddr: sandwich.attacker_addr,
							transition: "back_run",
							tokenIn: backRunSwap.token_in,
							tokenOut: backRunSwap.token_out,
							amountIn: backRunSwap.amount_in,
							amountOut: backRunSwap.amount_out,
							gasPrice: backRunSwap.gas_price,
							dexName: backRunSwap.dex_name,
						};
					}
				}
			}
		}

		return null;
	};

	const swapTransactionHashes = getSwapTransactionHashes();

	// Helper function to get transaction type and styling with enhanced information
	const getTransactionStyle = (hash: string) => {
		const swapDetails = getSwapDetails(hash);

		if (swapDetails) {
			const isVictim = swapDetails.transition === "victim";
			const isFrontRun = swapDetails.transition === "front_run";
			const isBackRun = swapDetails.transition === "back_run";
			const isAttacker = swapDetails.transition === "attacker";

			return {
				isSwap: true,
				swapDetails,
				rowClassName: isVictim
					? "bg-red-50 hover:bg-red-100 border-l-4 border-red-300"
					: isAttacker || isFrontRun || isBackRun
						? "bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-300"
						: "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-300",
				badgeClassName: isVictim
					? "bg-red-100 text-red-800 border-red-300"
					: isAttacker || isFrontRun || isBackRun
						? "bg-orange-100 text-orange-800 border-orange-300"
						: "bg-yellow-100 text-yellow-800 border-yellow-300",
				badgeText: isVictim
					? "Victim Swap"
					: isFrontRun
						? "Front-run"
						: isBackRun
							? "Back-run"
							: isAttacker
								? "Attacker Swap"
								: "MEV Swap",
			};
		}

		return {
			isSwap: false,
			swapDetails: null,
			rowClassName: "",
			badgeClassName: "bg-green-100 text-green-800",
			badgeText: "Success",
		};
	};

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
				{/* Back Button */}
				<div className="mb-6">
					<Link href="/">
						<Button variant="ghost" className="gap-2">
							<ArrowLeft className="w-4 h-4" />
							Back to Home
						</Button>
					</Link>
				</div>

				{/* Block Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">
						Block #{blockData?.number?.toLocaleString() || blockNumber}
					</h1>
					<p className="text-muted-foreground">
						Block details and transactions
					</p>
				</div>

				{/* Block Details */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Block Information</CardTitle>
						<div className="flex items-center justify-between">
							<CardDescription>
								Detailed information about this block
							</CardDescription>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline" className="gap-2">
										<Shield className="w-4 h-4" />
										MEV Analysis
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-2xl max-h-[80vh]">
									<DialogHeader>
										<DialogTitle className="flex items-center gap-2">
											<Search className="w-5 h-5" />
											Sandwich Attack Detection
										</DialogTitle>
										<DialogDescription>
											Analysis of potential MEV (Maximal Extractable Value)
											activities in this block
										</DialogDescription>
									</DialogHeader>

									<ScrollArea className="h-[60vh] pr-4">
										<div className="space-y-4">
											{/* Risk Level Alert */}
											<Alert
												className={`${
													mevAnalysis.riskLevel === "High"
														? "border-red-200 bg-red-50"
														: mevAnalysis.riskLevel === "Medium"
															? "border-yellow-200 bg-yellow-50"
															: "border-green-200 bg-green-50"
												}`}
											>
												<AlertTriangle
													className={`h-4 w-4 ${
														mevAnalysis.riskLevel === "High"
															? "text-red-600"
															: mevAnalysis.riskLevel === "Medium"
																? "text-yellow-600"
																: "text-green-600"
													}`}
												/>
												<AlertDescription
													className={`${
														mevAnalysis.riskLevel === "High"
															? "text-red-800"
															: mevAnalysis.riskLevel === "Medium"
																? "text-yellow-800"
																: "text-green-800"
													}`}
												>
													<strong>Risk Level: {mevAnalysis.riskLevel}</strong>
													{mevAnalysis.riskLevel === "High" &&
														" - Multiple suspicious patterns detected"}
													{mevAnalysis.riskLevel === "Medium" &&
														" - Some suspicious activity found"}
													{mevAnalysis.riskLevel === "Low" &&
														" - No significant MEV activity detected"}
												</AlertDescription>
											</Alert>

											{/* Analysis Results */}
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
												<Card>
													<CardContent className="p-4">
														<div className="text-2xl font-bold text-red-600">
															{mevAnalysis.sandwichAttacks.length}
														</div>
														<p className="text-sm text-muted-foreground">
															Sandwich Attacks
														</p>
													</CardContent>
												</Card>
												<Card>
													<CardContent className="p-4">
														<div className="text-2xl font-bold text-orange-600">
															{mevAnalysis.multipleSandwichAttacks.length}
														</div>
														<p className="text-sm text-muted-foreground">
															Multi-Layer Attacks
														</p>
													</CardContent>
												</Card>
												<Card>
													<CardContent className="p-4">
														<div className="text-2xl font-bold text-blue-600">
															{blockData?.transactions_hashes?.length || 0}
														</div>
														<p className="text-sm text-muted-foreground">
															Total Transactions
														</p>
													</CardContent>
												</Card>
											</div>

											{/* Detailed Findings */}
											{mevAnalysis.totalSandwiches > 0 && (
												<div>
													<h3 className="text-lg font-semibold mb-3">
														Detected Attacks
													</h3>
													<div className="space-y-3 max-h-60 overflow-y-auto">
														{mevAnalysis.sandwichAttacks.map(
															(attack, index) => (
																<Card
																	key={attack.attack_group_id || index}
																	className="border-red-200"
																>
																	<CardContent className="p-4">
																		<div className="flex items-center justify-between mb-2">
																			<Badge variant="destructive">
																				Sandwich Attack #
																				{attack.attack_group_id}
																			</Badge>
																			<Badge
																				variant="outline"
																				className="border-red-500 text-red-700"
																			>
																				High Confidence
																			</Badge>
																		</div>
																		<div className="text-sm text-muted-foreground">
																			Attack group {attack.attack_group_id}{" "}
																			detected in block {blockData.number}
																		</div>
																		<div className="text-xs text-muted-foreground mt-2">
																			Swaps: {attack.swaps.length} transactions
																		</div>
																	</CardContent>
																</Card>
															),
														)}
														{mevAnalysis.multipleSandwichAttacks.map(
															(attack, index) => (
																<Card
																	key={`multiple-${attack.attacker_addr}-${index}`}
																	className="border-orange-200"
																>
																	<CardContent className="p-4">
																		<div className="flex items-center justify-between mb-2">
																			<Badge variant="destructive">
																				Multi-Layer Attack #{index + 1}
																			</Badge>
																			<Badge
																				variant="outline"
																				className="border-orange-500 text-orange-700"
																			>
																				High Confidence
																			</Badge>
																		</div>
																		<div className="text-sm text-muted-foreground">
																			Complex attack pattern detected
																		</div>
																		<div className="text-xs text-muted-foreground mt-2">
																			Attacker:{" "}
																			<span className="font-mono">
																				{formatHash(attack.attacker_addr)}
																			</span>
																		</div>
																	</CardContent>
																</Card>
															),
														)}
													</div>
												</div>
											)}

											{/* How it works */}
											<Card className="bg-blue-50 border-blue-200">
												<CardContent className="p-4">
													<h4 className="font-semibold text-blue-900 mb-2">
														How Sandwich Attack Detection Works
													</h4>
													<ul className="text-sm text-blue-800 space-y-1">
														<li>
															• Analyzes transaction ordering and gas prices
														</li>
														<li>
															• Identifies patterns where the same address
															submits high-gas transactions around a victim
														</li>
														<li>• Checks for known MEV bot addresses</li>
														<li>
															• Calculates confidence based on gas price
															differences and address reputation
														</li>
													</ul>
												</CardContent>
											</Card>
										</div>
									</ScrollArea>
								</DialogContent>
							</Dialog>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Block Height
									</div>
									<div className="font-mono">
										{blockData?.number?.toLocaleString()}
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Block Hash
									</div>
									<div className="font-mono text-sm break-all flex items-center gap-2">
										{blockData?.hash}
										<Button variant="ghost" size="icon" className="h-6 w-6">
											<Copy className="w-3 h-3" />
										</Button>
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Parent Hash
									</div>
									<div className="font-mono text-sm break-all">
										{blockData?.parent_hash}
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Timestamp
									</div>
									<div>
										{blockData?.timestamp
											? formatTimestamp(blockData.timestamp)
											: "N/A"}
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Miner
									</div>
									<div className="font-mono text-sm">
										{blockData?.miner ? formatHash(blockData.miner) : "N/A"}
									</div>
								</div>
							</div>
							<div className="space-y-4">
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Transactions
									</div>
									<div className="font-semibold">
										{blockData?.transactions_hashes?.length || 0} transactions
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Gas Used
									</div>
									<div>
										{blockData?.gas_used?.toLocaleString() || "N/A"} (
										{blockData?.gas_used && blockData?.gas_limit
											? (
													(blockData.gas_used / blockData.gas_limit) *
													100
												).toFixed(2)
											: "0"}
										%)
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Gas Limit
									</div>
									<div>{blockData?.gas_limit?.toLocaleString() || "N/A"}</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Base Fee
									</div>
									<div>
										{blockData?.base_fee_per_gas
											? `${formatGwei(blockData.base_fee_per_gas)} Gwei`
											: "N/A"}
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-muted-foreground">
										Size
									</div>
									<div>
										{blockData?.size ? formatBytes(blockData.size) : "N/A"}
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Transactions */}
				<Card>
					<CardHeader>
						<CardTitle>
							Transactions ({blockData?.transactions_hashes?.length || 0})
						</CardTitle>
						<CardDescription>
							All transactions included in this block
						</CardDescription>
					</CardHeader>{" "}
					<CardContent>
						{mevAnalysis.hasSuspiciousActivity && (
							<Alert className="mb-4 border-yellow-200 bg-yellow-50">
								<AlertTriangle className="h-4 w-4 text-yellow-600" />
								<AlertDescription className="text-yellow-800">
									<strong>MEV Activity Detected:</strong> This block contains{" "}
									{mevAnalysis.totalSandwiches} suspicious transaction patterns.
									Swap transactions involved in MEV attacks are highlighted in
									yellow.
								</AlertDescription>
							</Alert>
						)}

						{swapTransactionHashes.size > 0 && (
							<div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-yellow-50 border border-blue-200 rounded-lg">
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
									<div className="text-center">
										<div className="flex items-center justify-center gap-2 text-blue-800 mb-1">
											<div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
											<span className="text-sm font-medium">
												Total MEV Swaps
											</span>
										</div>
										<div className="text-2xl font-bold text-blue-900">
											{swapTransactionHashes.size}
										</div>
										<div className="text-xs text-blue-700">
											{(
												(swapTransactionHashes.size /
													(blockData?.transactions_hashes?.length || 1)) *
												100
											).toFixed(1)}
											% of block
										</div>
									</div>

									<div className="text-center">
										<div className="flex items-center justify-center gap-2 text-red-800 mb-1">
											<div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
											<span className="text-sm font-medium">Victim Swaps</span>
										</div>
										<div className="text-2xl font-bold text-red-900">
											{blockData?.transactions_hashes?.filter((hash) => {
												const details = getSwapDetails(hash);
												return details?.transition === "victim";
											}).length || 0}
										</div>
									</div>

									<div className="text-center">
										<div className="flex items-center justify-center gap-2 text-orange-800 mb-1">
											<div className="w-3 h-3 bg-orange-200 border border-orange-300 rounded"></div>
											<span className="text-sm font-medium">
												Attacker Swaps
											</span>
										</div>
										<div className="text-2xl font-bold text-orange-900">
											{blockData?.transactions_hashes?.filter((hash) => {
												const details = getSwapDetails(hash);
												return (
													details?.transition === "attacker" ||
													details?.transition === "front_run" ||
													details?.transition === "back_run"
												);
											}).length || 0}
										</div>
									</div>

									<div className="text-center">
										<div className="flex items-center justify-center gap-2 text-purple-800 mb-1">
											<div className="w-3 h-3 bg-purple-200 border border-purple-300 rounded"></div>
											<span className="text-sm font-medium">Unique DEXs</span>
										</div>
										<div className="text-2xl font-bold text-purple-900">
											{
												new Set(
													blockData?.transactions_hashes
														?.map((hash) => {
															const details = getSwapDetails(hash);
															return details?.dexName;
														})
														.filter(Boolean),
												).size
											}
										</div>
									</div>
								</div>

								<div className="border-t border-blue-200 pt-3">
									<div className="flex items-center justify-between text-xs">
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-1">
												<div className="w-2 h-2 bg-red-200 border border-red-300 rounded"></div>
												<span className="text-red-700">
													Victim transactions (targeted by MEV)
												</span>
											</div>
											<div className="flex items-center gap-1">
												<div className="w-2 h-2 bg-orange-200 border border-orange-300 rounded"></div>
												<span className="text-orange-700">
													Attacker transactions (front/back-run)
												</span>
											</div>
										</div>
										<div className="text-blue-700">
											Look for the ⚡ icon to identify MEV activity
										</div>
									</div>
								</div>
							</div>
						)}

						<ScrollArea className="h-96">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Transaction Hash</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>MEV Details</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{blockData?.transactions_hashes?.map((hash) => {
										const style = getTransactionStyle(hash);
										return (
											<TableRow key={hash} className={style.rowClassName}>
												<TableCell>
													<Link
														href={`/tx/${hash}`}
														className="text-blue-600 hover:underline font-mono text-sm"
													>
														{formatHash(hash)}
													</Link>
												</TableCell>
												<TableCell>
													{style.isSwap ? (
														<div className="flex items-center gap-1">
															<Zap className="w-4 h-4 text-yellow-600" />
															<Badge
																variant="outline"
																className={style.badgeClassName}
															>
																{style.badgeText}
															</Badge>
														</div>
													) : (
														<span className="text-muted-foreground text-sm">
															Transfer
														</span>
													)}
												</TableCell>
												<TableCell>
													{style.isSwap && style.swapDetails ? (
														<div className="space-y-1">
															{style.swapDetails.dexName && (
																<div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
																	📊 {style.swapDetails.dexName}
																</div>
															)}
															{style.swapDetails.tokenIn &&
																style.swapDetails.tokenOut && (
																	<div className="text-xs text-muted-foreground flex items-center gap-1">
																		<span className="font-mono">
																			{getTokenSymbol(
																				style.swapDetails.tokenIn,
																			)}
																		</span>
																		<span>→</span>
																		<span className="font-mono">
																			{getTokenSymbol(
																				style.swapDetails.tokenOut,
																			)}
																		</span>
																	</div>
																)}
															{style.swapDetails.amountIn &&
																style.swapDetails.amountOut && (
																	<div className="text-xs text-muted-foreground">
																		💰{" "}
																		{formatTokenAmount(
																			style.swapDetails.amountIn,
																		)}{" "}
																		→{" "}
																		{formatTokenAmount(
																			style.swapDetails.amountOut,
																		)}
																	</div>
																)}
															{style.swapDetails.gasPrice && (
																<div className="text-xs text-gray-600">
																	⛽{" "}
																	{formatGwei(
																		parseInt(style.swapDetails.gasPrice),
																	)}{" "}
																	Gwei
																</div>
															)}
															{style.swapDetails.type === "single" &&
																style.swapDetails.attackGroupId && (
																	<div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
																		🎯 Attack #{style.swapDetails.attackGroupId}
																	</div>
																)}
															{style.swapDetails.type === "multiple" &&
																style.swapDetails.attackerAddr && (
																	<div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
																		👤{" "}
																		{formatHash(
																			style.swapDetails.attackerAddr,
																			6,
																		)}
																	</div>
																)}
														</div>
													) : (
														<span className="text-muted-foreground text-xs">
															-
														</span>
													)}
												</TableCell>
												<TableCell>
													<Badge
														variant="secondary"
														className="bg-green-100 text-green-800"
													>
														Success
													</Badge>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</ScrollArea>

						{(blockData?.transactions_hashes?.length || 0) > 10 && (
							<div className="mt-4 text-center">
								<p className="text-sm text-muted-foreground">
									Showing all {blockData?.transactions_hashes?.length}{" "}
									transactions
								</p>
							</div>
						)}

						{swapTransactionHashes.size > 0 && (
							<div className="mt-6 p-4 bg-gray-50 border rounded-lg">
								<h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
									<Zap className="w-4 h-4 text-yellow-600" />
									MEV Activity Summary
								</h4>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
									<div className="text-center p-2 bg-white rounded border">
										<div className="font-semibold text-lg text-blue-600">
											{
												new Set(
													blockData?.transactions_hashes
														?.map((hash) => {
															const details = getSwapDetails(hash);
															return details?.dexName;
														})
														.filter(Boolean),
												).size
											}
										</div>
										<div className="text-gray-600">DEXs Involved</div>
									</div>
									<div className="text-center p-2 bg-white rounded border">
										<div className="font-semibold text-lg text-orange-600">
											{mevAnalysis.totalSandwiches}
										</div>
										<div className="text-gray-600">Attack Groups</div>
									</div>
									<div className="text-center p-2 bg-white rounded border">
										<div className="font-semibold text-lg text-red-600">
											{blockData?.transactions_hashes?.filter((hash) => {
												const details = getSwapDetails(hash);
												return details?.transition === "victim";
											}).length || 0}
										</div>
										<div className="text-gray-600">Victim Txns</div>
									</div>
									<div className="text-center p-2 bg-white rounded border">
										<div className="font-semibold text-lg text-yellow-600">
											{(
												(swapTransactionHashes.size /
													(blockData?.transactions_hashes?.length || 1)) *
												100
											).toFixed(1)}
											%
										</div>
										<div className="text-gray-600">MEV Activity</div>
									</div>
								</div>

								{/* List of DEXs involved */}
								{(() => {
									const dexs = Array.from(
										new Set(
											blockData?.transactions_hashes
												?.map((hash) => {
													const details = getSwapDetails(hash);
													return details?.dexName;
												})
												.filter(Boolean),
										),
									);
									return (
										dexs.length > 0 && (
											<div className="mt-3 pt-3 border-t">
												<div className="text-xs text-gray-600 mb-1">
													DEXs involved in MEV activity:
												</div>
												<div className="flex flex-wrap gap-1">
													{dexs.map((dex) => (
														<span
															key={dex}
															className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
														>
															{dex}
														</span>
													))}
												</div>
											</div>
										)
									);
								})()}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
