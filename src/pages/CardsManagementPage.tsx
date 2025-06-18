import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import CollapsibleNavigationSidebar from '@/components/layout/CollapsibleNavigationSidebar';
import AppFooter from '@/components/layout/AppFooter';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { CreditCard, Lock, Unlock, ShieldAlert, Plane, Eye, EyeOff, WalletMinimal } from 'lucide-react';

interface CardData {
  id: string;
  name: string;
  last4: string;
  expiry: string;
  type: 'Visa' | 'Mastercard' | 'Amex' | 'Debit' | 'Credit';
  statusText: string; // e.g., "Active", "Frozen by User"
  isLocked: boolean;
  balance?: string; // For debit cards, e.g., "$2,500.00"
  availableCredit?: string; // For credit cards, e.g., "$10,000.00"
  cardHolder: string;
  issueDate: string;
}

interface TransactionData {
  id: string;
  cardId: string;
  date: string; // ISO format preferred e.g. "2024-07-15"
  description: string;
  amount: number; // positive for credits/refunds, negative for debits/purchases
  currency: string;
}

const initialCards: CardData[] = [
  { id: '1', name: 'Visa Signature Rewards', last4: '1234', expiry: '12/25', type: 'Visa', statusText: 'Active', isLocked: false, availableCredit: '$10,000.00', cardHolder: 'John Doe', issueDate: '12/21' },
  { id: '2', name: 'Mastercard World Elite', last4: '5678', expiry: '06/27', type: 'Mastercard', statusText: 'Frozen by User', isLocked: true, availableCredit: '$14,500.00', cardHolder: 'John Doe', issueDate: '06/23' },
  { id: '3', name: 'Checking Account Debit Card', last4: '9012', expiry: '03/26', type: 'Debit', statusText: 'Active', isLocked: false, balance: '$2,500.75', cardHolder: 'John Doe', issueDate: '03/22' },
];

const sampleTransactions: TransactionData[] = [
  { id: 't1', cardId: '1', date: '2024-07-15', description: 'Amazon Marketplace Purchase', amount: -75.99, currency: 'USD' },
  { id: 't2', cardId: '1', date: '2024-07-14', description: 'Starbucks Coffee', amount: -5.25, currency: 'USD' },
  { id: 't3', cardId: '1', date: '2024-07-12', description: 'Refund from Zappos', amount: 22.50, currency: 'USD' },
  { id: 't4', cardId: '2', date: '2024-07-16', description: 'United Airlines Ticket', amount: -450.00, currency: 'USD' },
  { id: 't5', cardId: '2', date: '2024-07-13', description: 'The French Laundry', amount: -220.70, currency: 'USD' },
  { id: 't6', cardId: '3', date: '2024-07-15', description: 'ATM Withdrawal - Main St', amount: -100.00, currency: 'USD' },
  { id: 't7', cardId: '3', date: '2024-07-14', description: 'Whole Foods Market', amount: -65.70, currency: 'USD' },
  { id: 't8', cardId: '1', date: '2024-07-10', description: 'Netflix Subscription', amount: -15.49, currency: 'USD' },
];

const CardsManagementPage = () => {
  const [cardsData, setCardsData] = useState<CardData[]>(initialCards);
  const [isTransactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedCardForTx, setSelectedCardForTx] = useState<CardData | null>(null);
  const [showFullCardNumber, setShowFullCardNumber] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log('CardsManagementPage loaded');
  }, []);

  const handleLockToggle = (cardId: string) => {
    setCardsData(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isLocked: !card.isLocked, statusText: !card.isLocked ? "Frozen by User" : "Active" } : card
      )
    );
  };

  const openTransactionDialog = (card: CardData) => {
    setSelectedCardForTx(card);
    setTransactionDialogOpen(true);
  };

  const toggleShowFullCardNumber = (cardId: string) => {
    setShowFullCardNumber(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };
  
  const getMaskedCardNumber = (card: CardData) => {
    if (showFullCardNumber[card.id]) {
      // In a real app, you wouldn't have the full number client-side for PCI compliance.
      // This is for display simulation only.
      const exampleFullNumber = card.type === 'Visa' ? `4916 1234 5678 ${card.last4}` : 
                                card.type === 'Mastercard' ? `5424 1800 1234 ${card.last4}` :
                                card.type === 'Amex' ? `3782 822463 ${card.last4.substring(0,1)}` : // Amex has different structure
                                `XXXX XXXX XXXX ${card.last4}`; 
      return exampleFullNumber;
    }
    return `•••• •••• •••• ${card.last4}`;
  };

  const getCardIcon = (type: CardData['type']) => {
    switch (type) {
      case 'Visa': return <img src="https://js.cx/__fconfig/assets/static/logo-visa-64.365f1728.png" alt="Visa" className="h-6 w-auto" />;
      case 'Mastercard': return <img src="https://js.cx/__fconfig/assets/static/mc_hrz_pos_rgb_56.b0470377.png" alt="Mastercard" className="h-6 w-auto" />;
      case 'Amex': return <img src="https://js.cx/__fconfig/assets/static/amex-logo-blue-box-rgb.83417738.png" alt="Amex" className="h-6 w-auto" />;
      default: return <CreditCard className="h-6 w-6 text-gray-700 dark:text-gray-300" />;
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <AppHeader />
      <div className="flex flex-1">
        <CollapsibleNavigationSidebar />
        <main className="flex-1 pt-16 pl-4 md:pl-20 lg:pl-64 overflow-y-auto transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Manage Your Cards</h1>
              <p className="text-muted-foreground">View card details, manage security settings, and review transactions.</p>
            </div>
            
            <section className="space-y-8">
              {cardsData.map(card => (
                <Card key={card.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-900">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-semibold">{card.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          Card ending in <span className="font-mono">{card.last4}</span> &nbsp;&nbsp;|&nbsp;&nbsp; Expires: {card.expiry}
                        </CardDescription>
                      </div>
                      {getCardIcon(card.type)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0 pb-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                        <div className="text-sm">
                            <span className="font-medium">Card Number:</span>
                            <span className="font-mono ml-2 tracking-wider">{getMaskedCardNumber(card)}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => toggleShowFullCardNumber(card.id)} aria-label={showFullCardNumber[card.id] ? "Hide full card number" : "Show full card number"}>
                            {showFullCardNumber[card.id] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div><span className="font-medium text-muted-foreground">Card Holder:</span> {card.cardHolder}</div>
                        <div><span className="font-medium text-muted-foreground">Issued:</span> {card.issueDate}</div>
                        <div>
                            <span className="font-medium text-muted-foreground">Status:</span> 
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${card.isLocked ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300'}`}>
                                {card.statusText}
                            </span>
                        </div>
                    </div>
                    
                    {card.balance && <p className="text-sm"><span className="font-medium text-muted-foreground">Current Balance:</span> {card.balance}</p>}
                    {card.availableCredit && <p className="text-sm"><span className="font-medium text-muted-foreground">Available Credit:</span> {card.availableCredit}</p>}

                    <Separator className="my-4" />
                    
                    <div className="flex items-center space-x-2">
                      <Toggle
                        id={`lock-toggle-${card.id}`}
                        aria-label="Lock or Unlock Card"
                        pressed={card.isLocked}
                        onPressedChange={() => handleLockToggle(card.id)}
                        variant="outline"
                        className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {card.isLocked ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                        {card.isLocked ? "Unlock Card" : "Lock Card"}
                      </Toggle>
                      <p className="text-xs text-muted-foreground">
                        {card.isLocked ? "Card is currently locked. Unlock to resume usage." : "Card is active. Lock to prevent usage."}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 justify-start bg-gray-50 dark:bg-gray-800/50 p-4 border-t dark:border-gray-700">
                    <Button variant="outline" onClick={() => openTransactionDialog(card)} className="dark:border-gray-600 dark:hover:bg-gray-700">
                      <WalletMinimal className="mr-2 h-4 w-4" /> View Transactions
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-red-600 border-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-300">
                          <ShieldAlert className="mr-2 h-4 w-4" /> Report Lost/Stolen
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
                        <DialogHeader>
                          <DialogTitle>Report Card Lost or Stolen</DialogTitle>
                          <DialogDescription>
                            You are about to report your "{card.name}" (ending in •••• {card.last4}) as lost or stolen.
                            This will permanently deactivate the card. A new card will be mailed to you.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-muted-foreground">If you proceed, this card will be unusable immediately. For urgent assistance or to dispute transactions, please call <a href="tel:1-800-BANKING" className="text-primary underline">1-800-BANKING</a>.</p>
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <Button type="button" variant="destructive" onClick={() => alert(`Card ${card.name} reported. This is a demo.`)}>Confirm Deactivation</Button>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="dark:border-gray-600 dark:hover:bg-gray-700">
                          <Plane className="mr-2 h-4 w-4" /> Set Travel Notice
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-gray-900">
                        <DialogHeader>
                          <DialogTitle>Set Travel Notice for {card.name}</DialogTitle>
                          <DialogDescription>
                            Let us know your travel plans to ensure uninterrupted service for card ending in •••• {card.last4}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`travel-destination-${card.id}`} className="text-right">Destination(s)</Label>
                            <Input id={`travel-destination-${card.id}`} placeholder="e.g., Paris, Tokyo" className="col-span-3 dark:bg-gray-800" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`travel-dates-${card.id}`} className="text-right">Departure Date</Label>
                            <Input id={`travel-dates-${card.id}`} type="date" className="col-span-3 dark:bg-gray-800" />
                          </div>
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`return-dates-${card.id}`} className="text-right">Return Date</Label>
                            <Input id={`return-dates-${card.id}`} type="date" className="col-span-3 dark:bg-gray-800" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`contact-phone-${card.id}`} className="text-right">Contact Phone</Label>
                            <Input id={`contact-phone-${card.id}`} type="tel" placeholder="Your phone number while traveling" className="col-span-3 dark:bg-gray-800" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={() => alert('Travel notice set. This is a demo.')}>Save Travel Notice</Button>
                           <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </section>
          </div>
        </main>
      </div>

      {/* Transaction Dialog - shared instance, content updated based on selectedCardForTx */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
        <DialogContent className="max-w-3xl w-[90vw] bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Transaction History for {selectedCardForTx?.name}</DialogTitle>
            <DialogDescription>
              Showing recent transactions for card ending in •••• {selectedCardForTx?.last4}.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto py-4 pr-2"> {/* Added pr-2 for scrollbar visibility */}
            {selectedCardForTx && sampleTransactions.filter(t => t.cardId === selectedCardForTx.id).length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right w-[100px]">Amount</TableHead>
                    <TableHead className="text-right hidden sm:table-cell w-[100px]">Currency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleTransactions
                    .filter(t => t.cardId === selectedCardForTx.id)
                    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date desc
                    .map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{new Date(tx.date).toLocaleDateString()}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell className={`text-right font-mono ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">{tx.currency}</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">No transactions found for this card in the selected period.</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AppFooter />
    </div>
  );
};

export default CardsManagementPage;