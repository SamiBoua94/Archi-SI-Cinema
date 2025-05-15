import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { MovieFilters } from "@/components/movies/MovieFilters";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { MovieWithSchedule } from "@/lib/types";
import { Helmet } from "react-helmet";

export default function MovieList() {
  const { city = "Paris" } = useParams();
  const decodedCity = decodeURIComponent(city);
  const [filters, setFilters] = useState({
    language: "",
    ageRating: "",
    sort: "popular",
  });

  // Construct the query string from filters
  const getQueryString = () => {
    const params = new URLSearchParams();
    if (filters.language) params.append("language", filters.language);
    if (filters.ageRating) params.append("ageRating", filters.ageRating);
    if (filters.sort) params.append("sort", filters.sort);
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  // Fetch movies with query parameters
  const { data: movies, isLoading, error } = useQuery<MovieWithSchedule[]>({
    queryKey: [`/api/movies/city/${decodedCity}${getQueryString()}`],
  });

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <>
      <Helmet>
        <title>Movies in {decodedCity} | CinéParis</title>
        <meta 
          name="description" 
          content={`Browse the latest movies playing in ${decodedCity}. Filter by language, age rating, and more to find the perfect film for your next cinema visit.`}
        />
      </Helmet>
      
      <section className="min-h-[80vh]">
        <MovieFilters 
          city={decodedCity} 
          onFilterChange={handleFilterChange} 
        />
        
        <MovieGrid 
          movies={movies} 
          isLoading={isLoading} 
          error={error instanceof Error ? error.message : undefined} 
        />
      </section>
    </>
  );
}
