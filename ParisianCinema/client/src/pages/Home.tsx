import Hero from "@/components/home/Hero";
import PopularMovies from "@/components/home/PopularMovies";
import FeaturedTheaters from "@/components/home/FeaturedTheaters";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>CinéParis - Find Movies in Parisian Theaters</title>
        <meta 
          name="description" 
          content="Discover the best movies playing in Parisian theaters. Browse movies by city, find showtimes, and get detailed information about films showing near you."
        />
      </Helmet>
      
      <section className="min-h-[80vh]">
        <Hero />
        <PopularMovies />
        <FeaturedTheaters />
      </section>
    </>
  );
}
