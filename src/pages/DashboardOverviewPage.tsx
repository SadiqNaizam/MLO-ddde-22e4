import React from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import AppHeader from '@/components/layout/AppHeader';
import CollapsibleNavigationSidebar from '@/components/layout/CollapsibleNavigationSidebar';
import AppFooter from '@/components/layout/AppFooter';

// Custom Widget Components
import AccountSummaryWidget from '@/components/AccountSummaryWidget';
import RecentTransactionsListWidget, { Transaction } from '@/components/RecentTransactionsListWidget';
import SpendingAnalysisChartWidget from '@/components/SpendingAnalysisChartWidget';

// shadcn/ui Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Sample Data for Widgets
// Explicitly typing to match AccountSummaryWidgetProps, including optional ones for clarity
const sampleAccount1: { 
  accountName: string; 
  accountType: string; 
  accountNumber: string; 
  currentBalance: number; 
  currencyCode?: string; 
  viewTransactionsPath?: string; 
  quickTransferPath?: string; 
} = {
  accountName: "Primary Checking",
  accountType: "Checking Account",
  accountNumber: "109876543210", // Full number for masking by component
  currentBalance: 15250.75,
  currencyCode: "USD",
  viewTransactionsPath: "/accounts", // Path from App.tsx
  quickTransferPath: "/transfers-and-bill-pay" // Path from App.tsx
};

const sampleAccount2: { 
  accountName: string; 
  accountType: string; 
  accountNumber: string; 
  currentBalance: number; 
  currencyCode?: string; 
  viewTransactionsPath?: string; 
  quickTransferPath?: string; 
} = {
  accountName: "High-Yield Savings",
  accountType: "Savings Account",
  accountNumber: "203948576021", // Full number for masking by component
  currentBalance: 48750.00,
  currencyCode: "USD",
  viewTransactionsPath: "/accounts", // Path from App.tsx
  quickTransferPath: "/transfers-and-bill-pay" // Path from App.tsx
};

const sampleTransactions: Transaction[] = [
  { id: 'txn1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), description: "Starbucks Coffee Central", amount: 5.75, type: 'debit', category: "Food & Drink", status: 'completed' },
  { id: 'txn2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), description: "Salary Deposit - Innovatech Ltd.", amount: 2500.00, type: 'credit', category: "Income", status: 'completed' },
  { id: 'txn3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), description: "Streaming Service Monthly", amount: 15.99, type: 'debit', category: "Entertainment", status: 'completed' },
  { id: 'txn4', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), description: "Electricity Bill Payment", amount: 75.50, type: 'debit', category: "Utilities", status: 'pending' },
  { id: 'txn5', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), description: "Online Bookstore Purchase", amount: 49.99, type: 'debit', category: "Shopping", status: 'completed' },
];

const DashboardOverviewPage: React.FC = () => {
  console.log('DashboardOverviewPage loaded');

  // The CollapsibleNavigationSidebar is 'fixed' and has a default expanded width of 'w-64' (16rem).
  // The 'main' content area needs 'pl-64' (padding-left: 16rem) to prevent overlap.
  // If the sidebar's collapsed/expanded state were managed globally (e.g., via Context API or Zustand),
  // this padding could be made dynamic to react to sidebar state changes (e.g., 'pl-20' when collapsed).
  // AppHeader height is 'h-16' (4rem). ScrollArea height is calculated as 100vh - header height.

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <AppHeader />
      <div className="flex flex-1">
        <CollapsibleNavigationSidebar />
        <main className="flex-1 pl-64"> {/* pl-64 for default expanded sidebar width (16rem) */}
          <ScrollArea className="h-[calc(100vh-4rem)]"> {/* Header is h-16 / 4rem */}
            <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
              
              <section>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">
                  Dashboard Overview
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Welcome back! Here's your financial summary.
                </p>
              </section>

              {/* Section 1: Account Summaries */}
              <section aria-labelledby="account-summaries-heading">
                <h2 id="account-summaries-heading" className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Account Summaries
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AccountSummaryWidget {...sampleAccount1} />
                  <AccountSummaryWidget {...sampleAccount2} />
                </div>
              </section>

              {/* Section 2: Recent Activity & Spending Analysis */}
              <section aria-labelledby="activity-spending-heading" className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                   <h2 id="recent-transactions-heading" className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Recent Transactions
                  </h2>
                  <RecentTransactionsListWidget 
                    transactions={sampleTransactions} 
                    maxHeightClassName="h-[400px]" // Example of customizing max height
                    onTransactionClick={(id) => console.log("Transaction clicked:", id)} // Placeholder action
                  />
                </div>
                <div className="lg:col-span-2">
                  <h2 id="spending-analysis-heading" className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Spending Analysis
                  </h2>
                  {/* SpendingAnalysisChartWidget uses its own default data if not provided */}
                  <SpendingAnalysisChartWidget />
                </div>
              </section>

              {/* Section 3: Quick Actions */}
              <section aria-labelledby="quick-actions-heading">
                <h2 id="quick-actions-heading" className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Quick Actions
                </h2>
                <Card className="shadow-sm bg-white dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Common Tasks</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3 sm:gap-4">
                    <Button asChild size="sm">
                      <Link to="/transfers-and-bill-pay">Make a Transfer</Link>
                    </Button>
                    <Button variant="outline" asChild size="sm">
                      <Link to="/transfers-and-bill-pay?tab=billpay">Pay a Bill</Link>
                    </Button>
                    <Button variant="secondary" asChild size="sm">
                      <Link to="/cards-management">Manage Cards</Link>
                    </Button>
                     <Button variant="ghost" asChild size="sm">
                      <Link to="/accounts">View All Accounts</Link>
                    </Button>
                  </CardContent>
                </Card>
              </section>

            </div>
            <AppFooter /> {/* Footer is part of the scrollable content area */}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;