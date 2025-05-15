import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film } from "@shared/schema";
import MovieCard from "@/components/movie-card";

export default function HomePage() {
  const [searchCity, setSearchCity] = useState("");
  const [, navigate] = useLocation();
  
  // Fetch popular films for showcase
  const { data: popularFilms } = useQuery<{ data: { films: Film[] } }>({
    queryKey: ["/api/films"],
  });
  
  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/city/${searchCity.trim()}`);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg p-8 mb-8 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Movies in Paris</h1>
          <p className="text-xl mb-8 opacity-90">
            Find the latest movies showing in Parisian theaters
          </p>
          
          <form onSubmit={handleCitySearch} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Enter a city (e.g. Paris)"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="bg-white/20 text-white placeholder:text-white/70 border-white/30 focus:ring-white"
            />
            <Button type="submit" variant="secondary" className="whitespace-nowrap">
              Search Movies
            </Button>
          </form>
        </div>
      </div>
      
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Films</h2>
          <Button variant="outline" onClick={() => navigate("/city/Paris")}>
            See All Movies
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularFilms?.data?.films?.slice(0, 4).map((film) => (
            <MovieCard key={film.id} film={film} />
          ))}
          
          {!popularFilms?.data?.films && (
            <p className="text-muted-foreground col-span-full text-center py-12">
              Loading popular films...
            </p>
          )}
        </div>
      </section>
      
      <Separator className="my-10" />
      
      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>For Movie Theaters</CardTitle>
            <CardDescription>
              Manage your theater's movie listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Are you a cinema owner? Create an account to add your movies
              and manage your screening schedule.
            </p>
            <Button onClick={() => navigate("/auth")}>
              Cinema Login
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>For Movie Lovers</CardTitle>
            <CardDescription>
              Find movies playing near you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Discover movies currently showing in Paris and other cities.
              No account needed!
            </p>
            <Button variant="outline" onClick={() => navigate("/city/Paris")}>
              Browse Movies
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <section className="bg-muted rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">About CinéAPI</h2>
        <p className="text-muted-foreground mb-4">
          CinéAPI provides a comprehensive REST API for movie theaters to publish
          their films and schedules, while allowing movie enthusiasts to easily
          browse current and upcoming screenings.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="font-bold text-3xl text-primary">100+</div>
            <div className="text-sm">Theaters</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-3xl text-primary">1,000+</div>
            <div className="text-sm">Movies</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-3xl text-primary">5,000+</div>
            <div className="text-sm">Screenings</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-3xl text-primary">10+</div>
            <div className="text-sm">Cities</div>
          </div>
        </div>
      </section>
    </div>
  );
}
