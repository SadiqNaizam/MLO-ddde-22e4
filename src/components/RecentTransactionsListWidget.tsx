import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle, // Fallback icon
} from 'lucide-react';

// Define the transaction structure expected by this widget
export interface Transaction {
  id: string;
  date: string; // Should be a parseable date string (e.g., ISO format)
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category?: string; // Optional: e.g., "Groceries", "Salary"
  status?: 'pending' | 'completed' | 'failed'; // Optional
  icon?: React.ElementType; // Optional: A Lucide icon component or any React component for category
}

interface RecentTransactionsListWidgetProps {
  transactions: Transaction[];
  title?: string;
  maxHeightClassName?: string; // e.g., "h-[300px]", defaults to "h-[350px]"
  onTransactionClick?: (transactionId: string) => void;
}

// Internal component for rendering each transaction item
const TransactionItem: React.FC<{ transaction: Transaction; onClick?: () => void }> = ({ transaction, onClick }) => {
  const { date, description, amount, type, status, icon: CategoryIcon } = transaction;
  const isCredit = type === 'credit';

  let StatusIndicatorIcon = null;
  if (status === 'pending') {
    StatusIndicatorIcon = <Clock className="h-3 w-3 mr-1" />;
  } else if (status === 'completed') {
    StatusIndicatorIcon = <CheckCircle2 className="h-3 w-3 mr-1" />;
  } else if (status === 'failed') {
    StatusIndicatorIcon = <XCircle className="h-3 w-3 mr-1" />;
  }

  const TypeOrCategoryIcon = CategoryIcon || (isCredit ? ArrowUpRight : ArrowDownLeft);
  const iconColor = CategoryIcon 
    ? 'text-gray-500 dark:text-gray-400' 
    : isCredit 
    ? 'text-green-500 dark:text-green-400' 
    : 'text-red-500 dark:text-red-400';

  return (
    <div
      className={`flex items-center justify-between py-3 px-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      aria-label={`Transaction: ${description}, Amount: ${amount}, Type: ${type}`}
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        <TypeOrCategoryIcon className={`h-5 w-5 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
        <div className="flex-grow overflow-hidden">
          <p 
            className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate" 
            title={description}
          >
            {description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <p className={`text-sm font-semibold ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isCredit ? '+' : '-'} ${amount.toFixed(2)}
        </p>
        {status && (
          <Badge 
            variant={status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'} 
            className="mt-1 text-xs py-0.5 px-1.5 h-5 inline-flex items-center"
          >
            {StatusIndicatorIcon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )}
      </div>
    </div>
  );
};

const RecentTransactionsListWidget: React.FC<RecentTransactionsListWidgetProps> = ({
  transactions,
  title = "Recent Transactions",
  maxHeightClassName = "h-[350px]", // Default max height for the scroll area
  onTransactionClick,
}) => {
  console.log('RecentTransactionsListWidget loaded');

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length > 0 ? (
          <ScrollArea className={`${maxHeightClassName} w-full`}>
            <div className="divide-y-0"> {/* Using border-b in TransactionItem instead */}
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onClick={onTransactionClick ? () => onTransactionClick(transaction.id) : undefined}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-10 w-10 mb-3 text-gray-400 dark:text-gray-500" />
            <p className="text-sm font-medium">No transactions to display.</p>
            <p className="text-xs">Check back later or try adjusting your filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsListWidget;