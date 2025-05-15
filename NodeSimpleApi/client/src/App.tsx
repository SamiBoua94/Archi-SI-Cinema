import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CinemaDashboard from "@/pages/cinema-dashboard";
import CityMovies from "@/pages/city-movies";
import MovieDetails from "@/pages/movie-details";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";

function Router() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Switch>
          {/* Public routes */}
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/city/:city" component={CityMovies} />
          <Route path="/movie/:id" component={MovieDetails} />
          
          {/* Protected routes */}
          <ProtectedRoute path="/dashboard" component={CinemaDashboard} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
