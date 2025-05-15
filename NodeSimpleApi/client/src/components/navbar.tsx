import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Film, User, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { cinema, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className={`sticky top-0 z-50 w-full border-b ${scrolled ? 'bg-background/80 backdrop-blur-sm' : 'bg-background'} transition-all duration-200`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CinéAPI</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium ${location === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            Home
          </Link>
          <Link href="/city/Paris" className={`text-sm font-medium ${location.startsWith('/city/') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            Browse Movies
          </Link>
          
          {cinema ? (
            <>
              <Link href="/dashboard" className={`text-sm font-medium ${location === '/dashboard' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                Dashboard
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span>{cinema.nom}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth">Login</Link>
            </Button>
          )}
        </nav>
        
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <Link href="/" className="block py-2" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link href="/city/Paris" className="block py-2" onClick={toggleMobileMenu}>
              Browse Movies
            </Link>
            
            {cinema ? (
              <>
                <Link href="/dashboard" className="block py-2" onClick={toggleMobileMenu}>
                  Dashboard
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild className="w-full" onClick={toggleMobileMenu}>
                <Link href="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
