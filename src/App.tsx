import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import InventoryUsage from "./pages/InventoryUsage";
import Staff from "./pages/Staff";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full animate-fade-in">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-16 flex items-center border-b border-border/30 glass-card m-3 mb-0 shadow-soft">
                <SidebarTrigger className="ml-4 hover-lift" />
                <div className="ml-6">
                  <h1 className="font-display font-semibold text-lg text-gradient">AquaManager</h1>
                  <p className="text-xs text-muted-foreground">Waterpark Inventory Management</p>
                </div>
              </header>
              <main className="flex-1 p-3 overflow-auto" style={{scrollBehavior: 'smooth'}}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/staff" element={<Staff />} />
                  <Route path="/inventory-usage" element={<InventoryUsage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
