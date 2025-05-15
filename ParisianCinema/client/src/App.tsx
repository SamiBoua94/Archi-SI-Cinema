import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MovieList from "@/pages/MovieList";
import MovieDetail from "@/pages/MovieDetail";
import Login from "@/pages/Login";
import TheaterDashboard from "@/pages/TheaterDashboard";
import AddMovie from "@/pages/AddMovie";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/useAuth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/films" component={MovieList} />
      <Route path="/films/ville/:ville" component={MovieList} />
      <Route path="/film/:id" component={MovieDetail} />
      <Route path="/login" component={Login} />
      <Route path="/cinema/dashboard" component={TheaterDashboard} />
      <Route path="/cinema/ajouter-film" component={AddMovie} />
      <Route path="/cinema/modifier-film/:id" component={AddMovie} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-6">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
