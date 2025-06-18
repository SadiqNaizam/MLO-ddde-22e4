import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

// Custom Layout Components
import AppHeader from '@/components/layout/AppHeader';
import CollapsibleNavigationSidebar from '@/components/layout/CollapsibleNavigationSidebar';
import AppFooter from '@/components/layout/AppFooter';

// Shadcn/ui Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast"; // For simple toasts
import { Toaster as SonnerToaster, toast as sonnerToast } from "@/components/ui/sonner"; // For richer notifications

// Icons
import { CalendarIcon, PlusCircle, Trash2, Edit3, AlertTriangle } from 'lucide-react';
import { cn } from "@/lib/utils";


// Form Schema for "Make a Transfer"
const transferFormSchema = z.object({
  fromAccount: z.string().min(1, "Please select a source account."),
  toBeneficiary: z.string().min(1, "Please select a beneficiary or enter account details."),
  amount: z.coerce.number().positive("Amount must be positive.").min(0.01, "Amount must be at least $0.01."),
  transferDate: z.date({
    required_error: "A transfer date is required.",
  }),
  remarks: z.string().max(200, "Remarks cannot exceed 200 characters.").optional(),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

// Placeholder data
const userAccounts = [
  { id: "acc1", name: "Primary Checking - xxxx1234", balance: 10500.75 },
  { id: "acc2", name: "Savings Account - xxxx5678", balance: 25000.00 },
];

const beneficiaries = [
  { id: "ben1", name: "John Smith (Savings)", details: "Bank ABC - Acct 987654321" },
  { id: "ben2", name: "Utility Power Co.", details: "Biller ID 100200" },
  { id: "ben3", name: "Alice Brown (External)", details: "XYZ Bank - Acct 112233445" },
];

const billers = [
  { id: "bill1", name: "City Water Dept.", category: "Utilities" },
  { id: "bill2", name: "Speedy Internet Inc.", category: "Internet" },
  { id: "bill3", name: "Global Credit Card", category: "Credit Card" },
];

const paymentHistory = [
  { id: "hist1", date: "2024-07-15", type: "Bill Payment", description: "City Water Dept.", amount: 75.50, status: "Completed" },
  { id: "hist2", date: "2024-07-12", type: "Transfer", description: "To John Smith", amount: 500.00, status: "Completed" },
  { id: "hist3", date: "2024-07-10", type: "Bill Payment", description: "Speedy Internet Inc.", amount: 59.99, status: "Completed" },
  { id: "hist4", date: "2024-07-05", type: "Transfer", description: "External Fund Transfer", amount: 1200.00, status: "Pending" },
];


const TransfersAndBillPayPage = () => {
  console.log('TransfersAndBillPayPage loaded');
  const [activeTab, setActiveTab] = useState("transfer");

  const transferForm = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      fromAccount: "",
      toBeneficiary: "",
      amount: undefined, // Explicitly undefined for number input
      remarks: "",
      transferDate: new Date(),
    },
  });

  function onTransferSubmit(data: TransferFormValues) {
    sonnerToast.success("Transfer Submitted!", {
      description: `Transfer of $${data.amount.toFixed(2)} from ${data.fromAccount} to ${data.toBeneficiary} scheduled for ${format(data.transferDate, "PPP")}.`,
    });
    console.log("Transfer data:", data);
    transferForm.reset(); // Reset form after submission
  }

  // Dummy state for beneficiaries table for example
  const [currentBeneficiaries, setCurrentBeneficiaries] = useState(beneficiaries);

  const handleDeleteBeneficiary = (beneficiaryId: string) => {
    setCurrentBeneficiaries(currentBeneficiaries.filter(b => b.id !== beneficiaryId));
    sonnerToast.info("Beneficiary Removed", { description: `Beneficiary with ID ${beneficiaryId} has been removed.` });
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader />
      <div className="flex flex-1">
        <CollapsibleNavigationSidebar />
        <main className="flex-1 ml-0 md:ml-20 lg:ml-64 transition-all duration-300 ease-in-out"> {/* Adjust margin based on sidebar state if possible, assuming default collapsed for small screens */}
          <ScrollArea className="h-[calc(100vh-var(--header-height)-var(--footer-height))]"> {/* Adjust height based on header/footer actual heights */}
             <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
              <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Transfers & Bill Pay</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your funds, pay bills, and set up beneficiaries all in one place.
                </p>
              </header>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                  <TabsTrigger value="transfer">Make a Transfer</TabsTrigger>
                  <TabsTrigger value="billPay">Pay Bills</TabsTrigger>
                  <TabsTrigger value="beneficiaries">Manage Beneficiaries</TabsTrigger>
                  <TabsTrigger value="history">Payment History</TabsTrigger>
                </TabsList>

                {/* Make a Transfer Tab */}
                <TabsContent value="transfer">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Initiate New Transfer</CardTitle>
                      <CardDescription>Transfer funds between your accounts or to external beneficiaries.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...transferForm}>
                        <form onSubmit={transferForm.handleSubmit(onTransferSubmit)} className="space-y-6">
                          <FormField
                            control={transferForm.control}
                            name="fromAccount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>From Account</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select source account" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {userAccounts.map(acc => (
                                      <SelectItem key={acc.id} value={acc.id}>
                                        {acc.name} (Balance: ${acc.balance.toFixed(2)})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={transferForm.control}
                            name="toBeneficiary"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>To Beneficiary</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select beneficiary" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {currentBeneficiaries.map(ben => (
                                      <SelectItem key={ben.id} value={ben.id}>
                                        {ben.name} - {ben.details}
                                      </SelectItem>
                                    ))}
                                     <Link to="#" onClick={(e) => { e.preventDefault(); setActiveTab("beneficiaries"); sonnerToast.info("Switched to Manage Beneficiaries tab."); }} className="text-sm text-blue-600 p-2 hover:underline flex items-center">
                                      <PlusCircle className="mr-1 h-4 w-4" /> Add New Beneficiary
                                    </Link>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={transferForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="0.00" {...field} onChange={event => field.onChange(+event.target.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={transferForm.control}
                            name="transferDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Transfer Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-[240px] pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) } // Disable past dates
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={transferForm.control}
                            name="remarks"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Remarks (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Reason for transfer, e.g., Monthly Rent" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button type="button" disabled={!transferForm.formState.isValid || transferForm.formState.isSubmitting}>
                                Review Transfer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Transfer Details</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Please review the transfer details before submitting.
                                  <div className="mt-4 space-y-2 text-sm">
                                    <p><strong>From:</strong> {transferForm.getValues("fromAccount") ? userAccounts.find(acc => acc.id === transferForm.getValues("fromAccount"))?.name : 'N/A'}</p>
                                    <p><strong>To:</strong> {transferForm.getValues("toBeneficiary") ? currentBeneficiaries.find(ben => ben.id === transferForm.getValues("toBeneficiary"))?.name : 'N/A'}</p>
                                    <p><strong>Amount:</strong> ${transferForm.getValues("amount")?.toFixed(2) || '0.00'}</p>
                                    <p><strong>Date:</strong> {transferForm.getValues("transferDate") ? format(transferForm.getValues("transferDate"), "PPP") : 'N/A'}</p>
                                    <p><strong>Remarks:</strong> {transferForm.getValues("remarks") || 'None'}</p>
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Edit</AlertDialogCancel>
                                <AlertDialogAction onClick={transferForm.handleSubmit(onTransferSubmit)}>
                                  Confirm & Transfer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pay Bills Tab */}
                <TabsContent value="billPay">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Pay Your Bills</CardTitle>
                      <CardDescription>Manage and pay your upcoming bills efficiently.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Simplified Form for Bill Pay - can be expanded with react-hook-form */}
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="biller">Select Biller</Label>
                          <Select>
                            <SelectTrigger id="biller"><SelectValue placeholder="Choose a biller" /></SelectTrigger>
                            <SelectContent>
                              {billers.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="billAmount">Amount</Label>
                          <Input id="billAmount" type="number" placeholder="0.00" />
                        </div>
                        <div>
                          <Label htmlFor="billPayFrom">Pay From Account</Label>
                           <Select>
                            <SelectTrigger id="billPayFrom"><SelectValue placeholder="Select source account" /></SelectTrigger>
                            <SelectContent>
                               {userAccounts.map(acc => (
                                <SelectItem key={acc.id} value={acc.id}>
                                  {acc.name} (Balance: ${acc.balance.toFixed(2)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="billPayDate">Payment Date</Label>
                           <Popover>
                              <PopoverTrigger asChild>
                                  <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    Pick a date
                                  </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" initialFocus />
                              </PopoverContent>
                            </Popover>
                        </div>
                        <Button type="submit" onClick={(e) => {e.preventDefault(); sonnerToast.info("Bill Payment Submitted (Demo)"); }}>Schedule Payment</Button>
                      </form>
                      <h3 className="font-semibold text-lg mt-8 mb-4">Scheduled Bills</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Biller</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>City Water Dept.</TableCell>
                            <TableCell>$75.50</TableCell>
                            <TableCell>July 30, 2024</TableCell>
                            <TableCell><Badge variant="secondary">Scheduled</Badge></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Manage Beneficiaries Tab */}
                <TabsContent value="beneficiaries">
                  <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Manage Beneficiaries</CardTitle>
                        <CardDescription>Add, view, or remove your saved beneficiaries.</CardDescription>
                      </div>
                      <Button onClick={() => sonnerToast.info("Add Beneficiary form would appear here.")}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Beneficiary
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {currentBeneficiaries.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentBeneficiaries.map((ben) => (
                              <TableRow key={ben.id}>
                                <TableCell className="font-medium">{ben.name}</TableCell>
                                <TableCell>{ben.details}</TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button variant="outline" size="icon" onClick={() => sonnerToast.info(`Edit beneficiary ${ben.name} (Demo)`)}>
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the beneficiary "{ben.name}".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteBeneficiary(ben.id)}>
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                         <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                            <AlertTriangle className="w-12 h-12 mb-3 text-gray-400" />
                            <p className="text-lg font-medium">No Beneficiaries Found</p>
                            <p>Click "Add New Beneficiary" to get started.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Payment History Tab */}
                <TabsContent value="history">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Payment History</CardTitle>
                      <CardDescription>Review your past transfers and bill payments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paymentHistory.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>{item.type}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>${item.amount.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge variant={item.status === 'Completed' ? 'default' : item.status === 'Pending' ? 'secondary' : 'destructive'}>
                                  {item.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <SonnerToaster richColors />
          </ScrollArea>
        </main>
      </div>
      <AppFooter />
    </div>
  );
};

// Minimal Card, Label components if not auto-imported or from shadcn
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
);
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
);
const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
);


export default TransfersAndBillPayPage;