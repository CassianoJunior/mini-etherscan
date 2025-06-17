import { ArrowLeft, Copy, AlertTriangle, Shield, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

// Mock block data
const blockData = {
  number: 18756432,
  hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
  parentHash: "0x0a1b2c3d4e5f6789abcdef1234567890abcdef1234567890abcdef1234567890",
  timestamp: "2024-01-15 14:30:45 UTC",
  miner: "0x1234567890123456789012345678901234567890",
  difficulty: "58,750,003,716,598,352,816,469",
  totalDifficulty: "58,750,003,716,598,352,816,469,123",
  size: "125,847 bytes",
  gasUsed: "29,876,543",
  gasLimit: "30,000,000",
  baseFeePerGas: "12.5 Gwei",
  transactions: 156,
  reward: "2.08 ETH",
}

// Sandwich attack detection logic
function detectSandwichAttacks(transactions: any[]) {
  const suspiciousPatterns = []
  const mevBots = new Set([
    "0x1234567890123456789012345678901234567890", // Mock MEV bot addresses
    "0x2345678901234567890123456789012345678901",
    "0x3456789012345678901234567890123456789012",
  ])

  // Look for sandwich patterns: high gas -> normal gas -> high gas from same address
  for (let i = 0; i < transactions.length - 2; i++) {
    const tx1 = transactions[i]
    const tx2 = transactions[i + 1]
    const tx3 = transactions[i + 2]

    // Check if first and third transactions are from the same address (potential sandwich)
    if (tx1.from === tx3.from && tx1.from !== tx2.from) {
      const gasPrice1 = Number.parseInt(tx1.gasPrice.replace(" Gwei", ""))
      const gasPrice2 = Number.parseInt(tx2.gasPrice.replace(" Gwei", ""))
      const gasPrice3 = Number.parseInt(tx3.gasPrice.replace(" Gwei", ""))

      // Check if sandwich pattern exists (high-low-high gas prices)
      if (gasPrice1 > gasPrice2 && gasPrice3 > gasPrice2) {
        suspiciousPatterns.push({
          type: "Potential Sandwich Attack",
          frontrun: tx1,
          victim: tx2,
          backrun: tx3,
          confidence: mevBots.has(tx1.from) ? "High" : "Medium",
        })
      }
    }
  }

  // Check for MEV bot activity
  const mevActivity = transactions.filter((tx) => mevBots.has(tx.from))

  return {
    hasSuspiciousActivity: suspiciousPatterns.length > 0 || mevActivity.length > 0,
    sandwichAttacks: suspiciousPatterns,
    mevBotTransactions: mevActivity.length,
    riskLevel: suspiciousPatterns.length > 2 ? "High" : suspiciousPatterns.length > 0 ? "Medium" : "Low",
  }
}

const transactions = [
  // Potential sandwich attack pattern
  {
    hash: "0xabc123def456789012345678901234567890123456789012345678901234567890",
    from: "0x1234567890123456789012345678901234567890", // MEV Bot
    to: "0x0987654321098765432109876543210987654321",
    value: "0.1 ETH",
    fee: "0.005 ETH",
    gasPrice: "25 Gwei", // High gas (frontrun)
    gasUsed: "21,000",
  },
  {
    hash: "0xdef456789012345678901234567890123456789012345678901234567890abc123",
    from: "0x9876543210987654321098765432109876543210", // Victim
    to: "0x1987654321098765432109876543210987654321",
    value: "5.0 ETH",
    fee: "0.002 ETH",
    gasPrice: "15 Gwei", // Normal gas (victim)
    gasUsed: "21,000",
  },
  {
    hash: "0x456789012345678901234567890123456789012345678901234567890abc123def",
    from: "0x1234567890123456789012345678901234567890", // Same MEV Bot
    to: "0x2987654321098765432109876543210987654321",
    value: "0.1 ETH",
    fee: "0.004 ETH",
    gasPrice: "24 Gwei", // High gas (backrun)
    gasUsed: "21,000",
  },
  // Normal transactions
  {
    hash: "0x789012345678901234567890123456789012345678901234567890abc123def456",
    from: "0x4567890123456789012345678901234567890123",
    to: "0x3987654321098765432109876543210987654321",
    value: "1.2 ETH",
    fee: "0.0018 ETH",
    gasPrice: "16 Gwei",
    gasUsed: "21,000",
  },
  {
    hash: "0x012345678901234567890123456789012345678901234567890abc123def456789",
    from: "0x5678901234567890123456789012345678901234",
    to: "0x4987654321098765432109876543210987654321",
    value: "0.8 ETH",
    fee: "0.0016 ETH",
    gasPrice: "14 Gwei",
    gasUsed: "21,000",
  },
]

export default function BlockPage({ params }: { params: { id: string } }) {
  const mevAnalysis = detectSandwichAttacks(transactions)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">BlockScan</h1>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-sm font-medium hover:text-blue-600">
                  Home
                </Link>
                <Link href="/blocks" className="text-sm font-medium hover:text-blue-600">
                  Blocks
                </Link>
                <Link href="/transactions" className="text-sm font-medium hover:text-blue-600">
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

        {/* Block Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Block #{blockData.number}</h1>
          <p className="text-muted-foreground">Block details and transactions</p>
        </div>

        {/* Block Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Block Information</CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription>Detailed information about this block</CardDescription>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Shield className="w-4 h-4" />
                    MEV Analysis
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Sandwich Attack Detection
                    </DialogTitle>
                    <DialogDescription>
                      Analysis of potential MEV (Maximal Extractable Value) activities in this block
                    </DialogDescription>
                  </DialogHeader>

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
                        {mevAnalysis.riskLevel === "High" && " - Multiple suspicious patterns detected"}
                        {mevAnalysis.riskLevel === "Medium" && " - Some suspicious activity found"}
                        {mevAnalysis.riskLevel === "Low" && " - No significant MEV activity detected"}
                      </AlertDescription>
                    </Alert>

                    {/* Analysis Results */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-red-600">{mevAnalysis.sandwichAttacks.length}</div>
                          <p className="text-sm text-muted-foreground">Potential Sandwich Attacks</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-orange-600">{mevAnalysis.mevBotTransactions}</div>
                          <p className="text-sm text-muted-foreground">MEV Bot Transactions</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">{blockData.transactions}</div>
                          <p className="text-sm text-muted-foreground">Total Transactions</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Detailed Findings */}
                    {mevAnalysis.sandwichAttacks.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Detected Sandwich Attacks</h3>
                        <div className="space-y-3">
                          {mevAnalysis.sandwichAttacks.map((attack, index) => (
                            <Card key={index} className="border-red-200">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="destructive">Sandwich Attack #{index + 1}</Badge>
                                  <Badge
                                    variant="outline"
                                    className={
                                      attack.confidence === "High"
                                        ? "border-red-500 text-red-700"
                                        : "border-yellow-500 text-yellow-700"
                                    }
                                  >
                                    {attack.confidence} Confidence
                                  </Badge>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <strong>Frontrun:</strong>
                                    <span className="font-mono ml-2">{attack.frontrun.hash.slice(0, 20)}...</span>
                                    <span className="ml-2 text-red-600">({attack.frontrun.gasPrice})</span>
                                  </div>
                                  <div>
                                    <strong>Victim:</strong>
                                    <span className="font-mono ml-2">{attack.victim.hash.slice(0, 20)}...</span>
                                    <span className="ml-2 text-gray-600">({attack.victim.gasPrice})</span>
                                  </div>
                                  <div>
                                    <strong>Backrun:</strong>
                                    <span className="font-mono ml-2">{attack.backrun.hash.slice(0, 20)}...</span>
                                    <span className="ml-2 text-red-600">({attack.backrun.gasPrice})</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    Attacker: <span className="font-mono">{attack.frontrun.from.slice(0, 20)}...</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* How it works */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">How Sandwich Attack Detection Works</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Analyzes transaction ordering and gas prices</li>
                          <li>
                            • Identifies patterns where the same address submits high-gas transactions around a victim
                          </li>
                          <li>• Checks for known MEV bot addresses</li>
                          <li>• Calculates confidence based on gas price differences and address reputation</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Block Height</label>
                  <div className="font-mono">{blockData.number}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Block Hash</label>
                  <div className="font-mono text-sm break-all flex items-center gap-2">
                    {blockData.hash}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Parent Hash</label>
                  <div className="font-mono text-sm break-all">{blockData.parentHash}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <div>{blockData.timestamp}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Miner</label>
                  <div className="font-mono text-sm">{blockData.miner}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transactions</label>
                  <div className="font-semibold">{blockData.transactions} transactions</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gas Used</label>
                  <div>
                    {blockData.gasUsed} (
                    {(
                      (Number.parseInt(blockData.gasUsed.replace(/,/g, "")) /
                        Number.parseInt(blockData.gasLimit.replace(/,/g, ""))) *
                      100
                    ).toFixed(2)}
                    %)
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gas Limit</label>
                  <div>{blockData.gasLimit}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Base Fee</label>
                  <div>{blockData.baseFeePerGas}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Block Reward</label>
                  <div className="font-semibold text-green-600">{blockData.reward}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Size</label>
                  <div>{blockData.size}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({blockData.transactions})</CardTitle>
            <CardDescription>All transactions included in this block</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.hash}>
                    <TableCell>
                      <Link href={`/tx/${tx.hash}`} className="text-blue-600 hover:underline font-mono text-sm">
                        {tx.hash.slice(0, 20)}...
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{tx.from.slice(0, 10)}...</TableCell>
                    <TableCell className="font-mono text-sm">{tx.to.slice(0, 10)}...</TableCell>
                    <TableCell className="font-semibold">{tx.value}</TableCell>
                    <TableCell>{tx.fee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-center">
              <Button variant="outline">Load More Transactions</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
