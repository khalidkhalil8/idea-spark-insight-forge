
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import EnterIdea from "./pages/EnterIdea";
import FindCompetitors from "./pages/FindCompetitors";
import IdentifyGaps from "./pages/IdentifyGaps";
import DifferentiationStrategy from "./pages/DifferentiationStrategy";
import ValidationPlan from "./pages/ValidationPlan";
import Summary from "./pages/Summary";
import Results from "./pages/Results";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/validate" element={<EnterIdea />} />
              <Route path="/competitors" element={<FindCompetitors />} />
              <Route path="/gaps" element={<IdentifyGaps />} />
              <Route path="/differentiation" element={<DifferentiationStrategy />} />
              <Route path="/validation-plan" element={<ValidationPlan />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/results" element={<Results />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
