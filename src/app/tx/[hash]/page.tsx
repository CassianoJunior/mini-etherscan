import { ArrowLeft, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock transaction data
const transactionData = {
  hash: "0xabc123def456789012345678901234567890123456789012345678901234567890",
  status: "Success",
  block: 18756432,
  timestamp: "2024-01-15 14:30:45 UTC",
  from: "0x1234567890123456789012345678901234567890",
  to: "0x0987654321098765432109876543210987654321",
  value: "1.5 ETH",
  transactionFee: "0.002 ETH",
  gasPrice: "15 Gwei",
  gasLimit: "21,000",
  gasUsed: "21,000",
  nonce: 42,
  position: 15,
  type: "Legacy",
  inputData: "0x",
}

export default function TransactionPage({ params }: { params: { hash: string } }) {
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

        {/* Transaction Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transaction Details</h1>
          <p className="text-muted-foreground">Information about this transaction</p>
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
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {transactionData.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Block</div>
                <Link href={`/block/${transactionData.block}`} className="text-blue-600 hover:underline font-semibold">
                  {transactionData.block}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
            <CardDescription>Detailed information about this transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
                <div className="font-mono text-sm break-all flex items-center gap-2 mt-1">
                  {transactionData.hash}
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {transactionData.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Block</label>
                  <div className="mt-1">
                    <Link href={`/block/${transactionData.block}`} className="text-blue-600 hover:underline">
                      {transactionData.block}
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                <div className="mt-1">{transactionData.timestamp}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">From</label>
                  <div className="font-mono text-sm break-all mt-1 flex items-center gap-2">
                    {transactionData.from}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">To</label>
                  <div className="font-mono text-sm break-all mt-1 flex items-center gap-2">
                    {transactionData.to}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Value</label>
                  <div className="text-xl font-semibold text-green-600 mt-1">{transactionData.value}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction Fee</label>
                  <div className="font-semibold mt-1">{transactionData.transactionFee}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gas Price</label>
                  <div className="mt-1">{transactionData.gasPrice}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gas Limit</label>
                  <div className="mt-1">{transactionData.gasLimit}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gas Used</label>
                  <div className="mt-1">
                    {transactionData.gasUsed} (
                    {(
                      (Number.parseInt(transactionData.gasUsed.replace(/,/g, "")) /
                        Number.parseInt(transactionData.gasLimit.replace(/,/g, ""))) *
                      100
                    ).toFixed(0)}
                    %)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nonce</label>
                  <div className="mt-1">{transactionData.nonce}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Position in Block</label>
                  <div className="mt-1">{transactionData.position}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="mt-1">{transactionData.type}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Input Data</label>
                <div className="font-mono text-sm bg-muted p-3 rounded-md mt-1">{transactionData.inputData}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
