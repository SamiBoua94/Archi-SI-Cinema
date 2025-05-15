import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { MovieTable } from "@/components/theater/MovieTable";
import { TheaterStatistics } from "@/components/theater/TheaterStatistics";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TheaterProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";

export default function TheaterDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const { data: theaterProfile, isLoading } = useQuery<TheaterProfile>({
    queryKey: ["/api/auth/user"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  if (isLoading) {
    return (
      <section className="min-h-[80vh]">
        <Skeleton className="h-10 w-64 mb-6" />
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32 mt-4 md:mt-0" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 mb-2" />
              <div className="overflow-x-auto">
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>Theater Dashboard | CinéParis</title>
        <meta 
          name="description" 
          content="Manage your theater's movie listings, view statistics, and update schedules from your CinéParis dashboard."
        />
      </Helmet>
      
      <section className="min-h-[80vh]">
        <h2 className="text-3xl font-bold font-['Montserrat'] text-[#333333] mb-6">
          Theater Dashboard
        </h2>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold font-['Montserrat']">
                  {theaterProfile?.theaterName || user?.theaterName}
                </h3>
                <p className="text-gray-600">
                  {theaterProfile?.address || user?.address}, {theaterProfile?.city || user?.city}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link href="/theater/add-movie">
                  <Button className="bg-[#E50914] hover:bg-[#E50914]/90 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-block">
                    <Plus className="mr-2" size={16} />
                    Add New Movie
                  </Button>
                </Link>
              </div>
            </div>
            
            <MovieTable />
            
            <TheaterStatistics />
          </div>
        </div>
      </section>
    </>
  );
}
