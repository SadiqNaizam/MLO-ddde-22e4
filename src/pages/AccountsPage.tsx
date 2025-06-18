import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import AppHeader from '@/components/layout/AppHeader';
import CollapsibleNavigationSidebar from '@/components/layout/CollapsibleNavigationSidebar';
import AppFooter from '@/components/layout/AppFooter';

// Custom Widget Component
import AccountSummaryWidget from '@/components/AccountSummaryWidget';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge'; // For transaction status

// Lucide Icons (optional, for table actions or indicators if needed)
import { Search } from 'lucide-react';

interface BankAccount {
  id: string;
  accountName: string;
  accountType: string;
  accountNumber: string;
  currentBalance: number;
  currencyCode?: string;
}

interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'pending' | 'completed' | 'failed';
  category?: string;
}

// Sample Data
const sampleAccounts: BankAccount[] = [
  {
    id: 'acc_chk_001',
    accountName: 'Primary Checking',
    accountType: 'Checking Account',
    accountNumber: '123456789012',
    currentBalance: 5210.75,
    currencyCode: 'USD',
  },
  {
    id: 'acc_sav_002',
    accountName: 'High-Yield Savings',
    accountType: 'Savings Account',
    accountNumber: '987654321098',
    currentBalance: 25340.12,
    currencyCode: 'USD',
  },
  {
    id: 'acc_cc_003',
    accountName: 'Platinum Rewards Card',
    accountType: 'Credit Card',
    accountNumber: '456789012345',
    currentBalance: -750.50, // Negative for credit card balance
    currencyCode: 'USD',
  },
];

const sampleTransactions: Transaction[] = [
  // Transactions for Primary Checking (acc_chk_001)
  { id: 'txn_001', accountId: 'acc_chk_001', date: '2024-07-22', description: 'Grocery Store Purchase', amount: 75.20, type: 'debit', status: 'completed', category: 'Groceries' },
  { id: 'txn_002', accountId: 'acc_chk_001', date: '2024-07-21', description: 'Salary Deposit', amount: 2500.00, type: 'credit', status: 'completed', category: 'Income' },
  { id: 'txn_003', accountId: 'acc_chk_001', date: '2024-07-20', description: 'Online Subscription', amount: 15.00, type: 'debit', status: 'completed', category: 'Subscription' },
  { id: 'txn_004', accountId: 'acc_chk_001', date: '2024-07-19', description: 'ATM Withdrawal', amount: 100.00, type: 'debit', status: 'completed', category: 'Cash' },
  { id: 'txn_005', accountId: 'acc_chk_001', date: '2024-07-18', description: 'Restaurant Bill', amount: 45.50, type: 'debit', status: 'pending', category: 'Food' },
  { id: 'txn_011', accountId: 'acc_chk_001', date: '2024-07-17', description: 'Utility Bill Payment - Electricity', amount: 120.00, type: 'debit', status: 'completed', category: 'Utilities' },
  { id: 'txn_012', accountId: 'acc_chk_001', date: '2024-07-16', description: 'Transfer to Savings', amount: 500.00, type: 'debit', status: 'completed', category: 'Transfer' },

  // Transactions for High-Yield Savings (acc_sav_002)
  { id: 'txn_006', accountId: 'acc_sav_002', date: '2024-07-21', description: 'Interest Earned', amount: 25.34, type: 'credit', status: 'completed', category: 'Interest' },
  { id: 'txn_007', accountId: 'acc_sav_002', date: '2024-07-15', description: 'Initial Deposit', amount: 10000.00, type: 'credit', status: 'completed', category: 'Deposit' },
  { id: 'txn_013', accountId: 'acc_sav_002', date: '2024-07-16', description: 'Transfer from Checking', amount: 500.00, type: 'credit', status: 'completed', category: 'Transfer' },


  // Transactions for Platinum Rewards Card (acc_cc_003)
  { id: 'txn_008', accountId: 'acc_cc_003', date: '2024-07-20', description: 'Amazon Purchase', amount: 120.99, type: 'debit', status: 'completed', category: 'Shopping' },
  { id: 'txn_009', accountId: 'acc_cc_003', date: '2024-07-18', description: 'Gas Station', amount: 55.30, type: 'debit', status: 'completed', category: 'Transport' },
  { id: 'txn_010', accountId: 'acc_cc_003', date: '2024-07-15', description: 'Payment Received', amount: 500.00, type: 'credit', status: 'completed', category: 'Payment' },
];

const ITEMS_PER_PAGE = 5;

const AccountsPage = () => {
  console.log('AccountsPage loaded');
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(sampleAccounts[0]?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("all-accounts");

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
    setSearchTerm('');
    setCurrentPage(1);
    // Optionally switch to transaction history tab if not already there
    // setActiveTab("transaction-history"); // This would require controlling Tabs component state
  };
  
  const selectedAccountDetails = useMemo(() => {
    return sampleAccounts.find(acc => acc.id === selectedAccountId);
  }, [selectedAccountId]);

  const filteredTransactions = useMemo(() => {
    if (!selectedAccountId) return [];
    return sampleTransactions
      .filter(tx => tx.accountId === selectedAccountId)
      .filter(tx => tx.description.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedAccountId, searchTerm]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <div className="flex flex-1">
        <CollapsibleNavigationSidebar />
        {/* Adjust pl- based on sidebar's width: pl-64 for expanded (256px), pl-20 for collapsed (80px) */}
        {/* For this example, we assume expanded sidebar by default */}
        <main className="flex-1 bg-muted/20 pl-64"> {/* Use pl-20 if sidebar is collapsed */}
          <ScrollArea className="h-[calc(100vh-4rem)]"> {/* Adjust height considering header */}
            <div className="p-6 space-y-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Accounts Overview</h1>
                <p className="text-muted-foreground">Manage your accounts and view transaction details.</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:w-[400px] mb-4">
                  <TabsTrigger value="all-accounts">All Accounts</TabsTrigger>
                  <TabsTrigger value="transaction-history">Transaction History</TabsTrigger>
                </TabsList>

                <TabsContent value="all-accounts">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Accounts</CardTitle>
                      <CardDescription>Summary of your active accounts. Click on an account to select it for detailed transaction viewing.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {sampleAccounts.map((account) => (
                        <div key={account.id} onClick={() => { handleAccountSelect(account.id); setActiveTab("transaction-history");}} className="cursor-pointer">
                          <AccountSummaryWidget
                            accountName={account.accountName}
                            accountType={account.accountType}
                            accountNumber={account.accountNumber}
                            currentBalance={account.currentBalance}
                            currencyCode={account.currencyCode}
                            viewTransactionsPath={`/accounts#${account.id}`} // Example for deep linking, actual handling might differ
                            quickTransferPath="/transfers-and-bill-pay"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transaction-history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Transaction History</CardTitle>
                      <CardDescription>
                        {selectedAccountDetails 
                          ? `Viewing transactions for ${selectedAccountDetails.accountName} (${selectedAccountDetails.accountNumber.slice(-4)}).`
                          : "Select an account to view its transactions."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Select onValueChange={handleAccountSelect} value={selectedAccountId}>
                          <SelectTrigger className="w-full sm:w-[280px]">
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                          <SelectContent>
                            {sampleAccounts.map(account => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.accountName} (•••• {account.accountNumber.slice(-4)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="relative flex-grow">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search transaction descriptions..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-10 w-full"
                            disabled={!selectedAccountId}
                          />
                        </div>
                      </div>

                      {selectedAccountId ? (
                        <>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Description</TableHead>
                                  <TableHead className="text-right">Amount</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Category</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {paginatedTransactions.length > 0 ? (
                                  paginatedTransactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                      <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                                      <TableCell className="font-medium">{tx.description}</TableCell>
                                      <TableCell className={`text-right ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant={tx.type === 'credit' ? 'default' : 'secondary'} className="capitalize">
                                          {tx.type}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Badge 
                                          variant={
                                            tx.status === 'completed' ? 'default' : 
                                            tx.status === 'pending' ? 'secondary' : 'destructive'
                                          } 
                                          className="capitalize"
                                        >
                                          {tx.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>{tx.category || 'N/A'}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                      No transactions found for this account{searchTerm && " matching your search"}.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                          {totalPages > 1 && (
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                  />
                                </PaginationItem>
                                {[...Array(totalPages)].map((_, i) => (
                                  <PaginationItem key={i}>
                                    <PaginationLink 
                                      href="#" 
                                      onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}
                                      isActive={currentPage === i + 1}
                                    >
                                      {i + 1}
                                    </PaginationLink>
                                  </PaginationItem>
                                ))}
                                <PaginationItem>
                                  <PaginationNext
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          <p>Please select an account to view its transaction history.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default AccountsPage;