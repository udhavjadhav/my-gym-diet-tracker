import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WaterHistory from "./pages/WaterHistory";
import ProteinHistory from "./pages/ProteinHistory";
import WorkoutHistory from "./pages/WorkoutHistory";
import CaloriesHistory from "./pages/CaloriesHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/water-history" element={<WaterHistory />} />
        <Route path="/protein-history" element={<ProteinHistory />} />
        <Route path="/workout-history" element={<WorkoutHistory />} />
        <Route path="/calories-history" element={<CaloriesHistory />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
