import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import AccountsPage from "./pages/AccountsPage";
import CardsManagementPage from "./pages/CardsManagementPage";
import DashboardOverviewPage from "./pages/DashboardOverviewPage";
import SettingsPage from "./pages/SettingsPage";
import TransfersAndBillPayPage from "./pages/TransfersAndBillPayPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<DashboardOverviewPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/cards-management" element={<CardsManagementPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/transfers-and-bill-pay" element={<TransfersAndBillPayPage />} />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;
