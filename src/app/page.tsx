import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// Mock data
const recentBlocks = [
  {
    number: 18756432,
    hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
    timestamp: "12 secs ago",
    miner: "0x1234...5678",
    transactions: 156,
    gasUsed: "29,876,543",
    gasLimit: "30,000,000",
  },
  {
    number: 18756431,
    hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    timestamp: "24 secs ago",
    miner: "0x2345...6789",
    transactions: 203,
    gasUsed: "29,123,456",
    gasLimit: "30,000,000",
  },
  {
    number: 18756430,
    hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
    timestamp: "36 secs ago",
    miner: "0x3456...7890",
    transactions: 178,
    gasUsed: "28,654,321",
    gasLimit: "30,000,000",
  },
]

const recentTransactions = [
  {
    hash: "0xabc123def456789012345678901234567890123456789012345678901234567890",
    from: "0x1234567890123456789012345678901234567890",
    to: "0x0987654321098765432109876543210987654321",
    value: "1.5 ETH",
    fee: "0.002 ETH",
    timestamp: "8 secs ago",
  },
  {
    hash: "0xdef456789012345678901234567890123456789012345678901234567890abc123",
    from: "0x2345678901234567890123456789012345678901",
    to: "0x1987654321098765432109876543210987654321",
    value: "0.75 ETH",
    fee: "0.0015 ETH",
    timestamp: "15 secs ago",
  },
  {
    hash: "0x456789012345678901234567890123456789012345678901234567890abc123def",
    from: "0x3456789012345678901234567890123456789012",
    to: "0x2987654321098765432109876543210987654321",
    value: "2.1 ETH",
    fee: "0.0025 ETH",
    timestamp: "22 secs ago",
  },
]

export default function HomePage() {
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
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Ethereum Blockchain Explorer</h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search by Address / Txn Hash / Block / Token" className="pl-10 h-12" />
              </div>
              <Button className="h-12 px-6">Search</Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">18,756,432</div>
              <p className="text-sm text-muted-foreground">Latest Block</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">1.2M</div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">$2,456</div>
              <p className="text-sm text-muted-foreground">ETH Price</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">15.2 Gwei</div>
              <p className="text-sm text-muted-foreground">Gas Price</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Blocks and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Blocks */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Blocks</CardTitle>
              <CardDescription>Most recent blocks on the Ethereum blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBlocks.map((block) => (
                  <div key={block.number} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      </div>
                      <div>
                        <Link href={`/block/${block.number}`} className="font-medium text-blue-600 hover:underline">
                          {block.number}
                        </Link>
                        <div className="text-sm text-muted-foreground">{block.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{block.transactions} txns</div>
                      <div className="text-sm text-muted-foreground">Miner: {block.miner}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/blocks">
                  <Button variant="outline" className="w-full">
                    View All Blocks
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Transactions</CardTitle>
              <CardDescription>Most recent transactions on the network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.hash} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-green-600 rounded"></div>
                      </div>
                      <div>
                        <Link href={`/tx/${tx.hash}`} className="font-medium text-blue-600 hover:underline text-sm">
                          {tx.hash.slice(0, 20)}...
                        </Link>
                        <div className="text-sm text-muted-foreground">{tx.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{tx.value}</div>
                      <div className="text-sm text-muted-foreground">Fee: {tx.fee}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/transactions">
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
