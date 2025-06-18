import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, ListChecks, ArrowRightLeft } from 'lucide-react';

interface AccountSummaryWidgetProps {
  accountName: string;
  accountType: string; // e.g., "Primary Checking", "High-Yield Savings"
  accountNumber: string; // Full account number, will be masked by the component
  currentBalance: number;
  currencyCode?: string; // e.g., "USD", "EUR", defaults to "USD"
  viewTransactionsPath?: string; // Defaults to "/accounts"
  quickTransferPath?: string; // Defaults to "/transfers-and-bill-pay"
}

const AccountSummaryWidget: React.FC<AccountSummaryWidgetProps> = ({
  accountName,
  accountType,
  accountNumber,
  currentBalance,
  currencyCode = 'USD',
  viewTransactionsPath = '/accounts',
  quickTransferPath = '/transfers-and-bill-pay',
}) => {
  console.log('AccountSummaryWidget loaded for:', accountName);

  const maskAccountNumber = (number: string): string => {
    if (number.length <= 4) {
      return `•••• ${number}`;
    }
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(currentBalance);

  return (
    <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">{accountName}</CardTitle>
            <CardDescription className="text-sm text-gray-500">{accountType}</CardDescription>
          </div>
          <Landmark className="h-8 w-8 text-blue-600" />
        </div>
      </CardHeader>

      <CardContent className="flex-grow pt-2 pb-4">
        <div className="mb-4">
          <p className="text-xs text-gray-500">Account Number</p>
          <p className="text-md font-mono text-gray-700 tracking-wider">{maskAccountNumber(accountNumber)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-3xl font-bold text-blue-700">{formattedBalance}</p>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-3 p-4 border-t bg-gray-50">
        <Button variant="outline" asChild className="w-full">
          <Link to={viewTransactionsPath}>
            <ListChecks className="mr-2 h-4 w-4" />
            View Transactions
          </Link>
        </Button>
        <Button variant="default" asChild className="w-full">
          <Link to={quickTransferPath}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Quick Transfer
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountSummaryWidget;