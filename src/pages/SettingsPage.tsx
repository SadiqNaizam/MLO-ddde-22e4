import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';

// Custom Layout Components
import AppHeader from '@/components/layout/AppHeader';
import CollapsibleNavigationSidebar from '@/components/layout/CollapsibleNavigationSidebar';
import AppFooter from '@/components/layout/AppFooter';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast"; // For form submission feedback

// Lucide Icons
import { User, Lock, Bell, Edit3, Save } from 'lucide-react';

// Zod Schemas for Form Validation
const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required").default("John Doe"),
  email: z.string().email("Invalid email address").default("john.doe@example.com"),
  phoneNumber: z.string().optional().default("N/A"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"], // Point error to confirmPassword field
});

const notificationsSchema = z.object({
  emailNewLogins: z.boolean().default(true),
  smsLargeTransactions: z.boolean().default(false),
  pushAccountUpdates: z.boolean().default(true),
  promotionalEmails: z.boolean().default(false),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type NotificationsFormData = z.infer<typeof notificationsSchema>;

const SettingsPage = () => {
  console.log('SettingsPage loaded');

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "(555) 123-4567",
    }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const notificationsForm = useForm<NotificationsFormData>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNewLogins: true,
      smsLargeTransactions: false,
      pushAccountUpdates: true,
      promotionalEmails: false,
    }
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log("Profile data submitted:", data);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    // In a real app, call API to update profile
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log("Password change data submitted:", data);
    toast({ title: "Password Changed", description: "Your password has been updated successfully." });
    passwordForm.reset(); // Clear form
    // In a real app, call API to change password
  };

  const onNotificationsSubmit = (data: NotificationsFormData) => {
    console.log("Notification preferences submitted:", data);
    toast({ title: "Preferences Saved", description: "Your notification settings have been updated." });
    // In a real app, call API to save preferences
  };


  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <AppHeader />
      <div className="flex flex-1">
        <CollapsibleNavigationSidebar />
        {/* Main content area needs margin-left to accommodate the fixed sidebar */}
        {/* Assuming sidebar expanded width is w-64 (256px). Adjust if sidebar width changes. */}
        <main className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300 ease-in-out"> {/* ml-64 for expanded sidebar */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
          </header>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>View and update your personal details. For changes to critical information, please contact support.</CardDescription>
                </CardHeader>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <CardContent className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                             <FormDescription>This email is used for login and important communications.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={profileForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" /> Save Profile Changes
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Choose a strong password and update it regularly.</CardDescription>
                  </CardHeader>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                      <CardContent className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormDescription>Must be at least 8 characters long.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter className="border-t px-6 py-4">
                        <Button type="submit">
                          <Lock className="mr-2 h-4 w-4" /> Update Password
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                    <CardDescription>Add an extra layer of security to your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa-switch" className="text-base">Enable 2FA</Label>
                        <p className="text-sm text-muted-foreground">
                          Secure your account with an authenticator app or SMS codes.
                        </p>
                      </div>
                      <Switch id="2fa-switch" defaultChecked={false} aria-label="Toggle Two-Factor Authentication" />
                    </div>
                     <Button variant="outline" disabled>
                        <Edit3 className="mr-2 h-4 w-4" /> Manage 2FA Devices
                     </Button>
                     <p className="text-xs text-muted-foreground">Device management functionality is not yet available.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified about account activity.</CardDescription>
                </CardHeader>
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}>
                    <CardContent className="space-y-6">
                      <FormField
                        control={notificationsForm.control}
                        name="emailNewLogins"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email for New Logins</FormLabel>
                              <FormDescription>Receive an email alert when your account is accessed from a new device or location.</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationsForm.control}
                        name="smsLargeTransactions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">SMS for Large Transactions</FormLabel>
                              <FormDescription>Get an SMS alert for transactions over a certain amount (e.g., $500).</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationsForm.control}
                        name="pushAccountUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Push Notifications for Updates</FormLabel>
                              <FormDescription>Receive push notifications for important account updates via our mobile app (if applicable).</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={notificationsForm.control}
                        name="promotionalEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Promotional Emails</FormLabel>
                              <FormDescription>Receive emails about new features, products, and special offers.</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" /> Save Notification Preferences
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default SettingsPage;