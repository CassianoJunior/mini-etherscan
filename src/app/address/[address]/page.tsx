import { ArrowLeft, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Mock address data
const addressData = {
  address: "0x1234567890123456789012345678901234567890",
  balance: "15.7834 ETH",
  usdValue: "$38,756.23",
  transactionCount: 1247,
  firstSeen: "2021-03-15",
  lastSeen: "2024-01-15",
}

const transactions = [
  {
    hash: "0xabc123def456789012345678901234567890123456789012345678901234567890",
    block: 18756432,
    age: "2 mins ago",
    from: "0x1234567890123456789012345678901234567890",
    to: "0x0987654321098765432109876543210987654321",
    value: "1.5 ETH",
    fee: "0.002 ETH",
    type: "OUT",
  },
  {
    hash: "0xdef456789012345678901234567890123456789012345678901234567890abc123",
    block: 18756420,
    age: "15 mins ago",
    from: "0x0987654321098765432109876543210987654321",
    to: "0x1234567890123456789012345678901234567890",
    value: "0.75 ETH",
    fee: "0.0015 ETH",
    type: "IN",
  },
  {
    hash: "0x456789012345678901234567890123456789012345678901234567890abc123def",
    block: 18756400,
    age: "1 hour ago",
    from: "0x1234567890123456789012345678901234567890",
    to: "0x2987654321098765432109876543210987654321",
    value: "2.1 ETH",
    fee: "0.0025 ETH",
    type: "OUT",
  },
]

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
]

export default function AddressPage({ params }: { params: { address: string } }) {
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

        {/* Address Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Address</h1>
          <div className="font-mono text-sm break-all flex items-center gap-2">
            {addressData.address}
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Address Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Address balance and activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ETH Balance</label>
                <div className="text-2xl font-bold text-green-600">{addressData.balance}</div>
                <div className="text-sm text-muted-foreground">{addressData.usdValue}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Transactions</label>
                <div className="text-2xl font-bold">{addressData.transactionCount.toLocaleString()}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">First Seen</label>
                <div className="text-lg font-semibold">{addressData.firstSeen}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Seen</label>
                <div className="text-lg font-semibold">{addressData.lastSeen}</div>
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
                <CardDescription>All transactions for this address</CardDescription>
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
                    {transactions.map((tx) => (
                      <TableRow key={tx.hash}>
                        <TableCell>
                          <Link href={`/tx/${tx.hash}`} className="text-blue-600 hover:underline font-mono text-sm">
                            {tx.hash.slice(0, 20)}...
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/block/${tx.block}`} className="text-blue-600 hover:underline">
                            {tx.block}
                          </Link>
                        </TableCell>
                        <TableCell>{tx.age}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {tx.from.slice(0, 10)}...
                          {tx.type === "OUT" && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              OUT
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {tx.to.slice(0, 10)}...
                          {tx.type === "IN" && (
                            <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                              IN
                            </Badge>
                          )}
                        </TableCell>
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
          </TabsContent>

          <TabsContent value="tokens">
            <Card>
              <CardHeader>
                <CardTitle>Token Holdings</CardTitle>
                <CardDescription>ERC-20 tokens held by this address</CardDescription>
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
                            <div className="text-sm text-muted-foreground">{token.symbol}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{token.balance}</TableCell>
                        <TableCell className="font-semibold text-green-600">{token.value}</TableCell>
                        <TableCell className="font-mono text-sm">{token.contract.slice(0, 20)}...</TableCell>
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
  )
}
