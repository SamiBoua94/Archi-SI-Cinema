import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MovieForm } from "@/components/theater/MovieForm";
import { Helmet } from "react-helmet";

export default function AddMovie() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { id } = useParams();

  const isEditing = !!id;
  const pageTitle = isEditing ? "Edit Movie" : "Add New Movie";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle} | CinéParis</title>
        <meta 
          name="description" 
          content={`${isEditing ? 'Edit existing' : 'Add new'} movie details, schedules, and showtimes for your theater on CinéParis.`}
        />
      </Helmet>
      
      <section className="min-h-[80vh]">
        <MovieForm movieId={id} />
      </section>
    </>
  );
}
