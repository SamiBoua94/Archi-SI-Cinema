import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

export default function Hero() {
  const [city, setCity] = useState("Paris");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      navigate(`/films/ville/${encodeURIComponent(city.trim())}`);
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg" style={{ height: "400px" }}>
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')", 
          filter: "brightness(0.6)" 
        }}
        aria-hidden="true"
      ></div>
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#032541]/70 to-transparent"
        aria-hidden="true"
      ></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12">
        <h2 className="text-4xl md:text-5xl text-white font-bold font-['Montserrat'] mb-4">
          Trouvez les meilleurs films à Paris
        </h2>
        <p className="text-xl text-white max-w-xl mb-8">
          Découvrez ce qui est à l'affiche dans les cinémas parisiens et réservez votre prochaine expérience cinéma.
        </p>
        
        <form className="max-w-lg" onSubmit={handleSearch}>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Entrez le nom d'une ville..."
                className="w-full px-4 py-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E50914] text-black"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <MapPin className="absolute right-3 top-3 text-gray-400" size={18} />
            </div>
            <Button 
              type="submit" 
              className="bg-[#E50914] hover:bg-[#E50914]/90 text-white font-bold py-6 px-6 rounded-lg transition-colors"
            >
              <Search className="mr-2" size={18} />
              Chercher Films
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
