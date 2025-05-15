import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Film, Programmation } from "@shared/schema";
import FilmForm from "@/components/film-form";
import ProgrammingForm from "@/components/programming-form";
import MovieList from "@/components/movie-list";

export default function CinemaDashboard() {
  const { cinema } = useAuth();
  const [activeTab, setActiveTab] = useState("films");
  const [showFilmForm, setShowFilmForm] = useState(false);
  const [showProgrammingForm, setShowProgrammingForm] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [selectedProgramming, setSelectedProgramming] = useState<Programmation | null>(null);
  
  // Fetch cinema's films
  const { data: filmsData, isLoading: isLoadingFilms } = useQuery<{ data: { films: Film[] } }>({
    queryKey: ["/api/films"],
  });
  
  // Fetch cinema's programmations
  const { data: programmationsData, isLoading: isLoadingProgrammations } = useQuery<{ data: { programmations: Programmation[] } }>({
    queryKey: [`/api/programmations/cinema/${cinema?.id}`],
    enabled: !!cinema?.id,
  });
  
  const handleAddFilm = () => {
    setSelectedFilm(null);
    setShowFilmForm(true);
  };
  
  const handleEditFilm = (film: Film) => {
    setSelectedFilm(film);
    setShowFilmForm(true);
  };
  
  const handleAddProgramming = () => {
    setSelectedProgramming(null);
    setShowProgrammingForm(true);
  };
  
  const handleEditProgramming = (programming: Programmation) => {
    setSelectedProgramming(programming);
    setShowProgrammingForm(true);
  };
  
  if (!cinema) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Not Authorized</h1>
        <p className="text-muted-foreground">Please log in to access the dashboard.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{cinema.nom} Dashboard</h1>
          <p className="text-muted-foreground">{cinema.ville}, {cinema.adresse}</p>
        </div>
        
        <div className="flex gap-2">
          {activeTab === "films" && (
            <Button onClick={handleAddFilm}>Add New Film</Button>
          )}
          {activeTab === "programmations" && (
            <Button onClick={handleAddProgramming}>Add New Schedule</Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="films" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="films">Films</TabsTrigger>
          <TabsTrigger value="programmations">Schedules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="films" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Films</CardTitle>
              <CardDescription>
                Add or edit films that your cinema will be showing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFilms ? (
                <p className="text-center py-4">Loading films...</p>
              ) : (
                <MovieList 
                  films={filmsData?.data?.films || []} 
                  onEditFilm={handleEditFilm} 
                  mode="manage"
                />
              )}
              
              {!isLoadingFilms && (!filmsData?.data?.films || filmsData.data.films.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No films found. Add your first film!</p>
                  <Button onClick={handleAddFilm}>Add New Film</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="programmations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Schedules</CardTitle>
              <CardDescription>
                Add or edit screening schedules for your films
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProgrammations ? (
                <p className="text-center py-4">Loading schedules...</p>
              ) : (
                <div className="space-y-4">
                  {/* Programming list would be rendered here */}
                  {(!programmationsData?.data?.programmations || programmationsData.data.programmations.length === 0) && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No schedules found. Add your first schedule!</p>
                      <Button onClick={handleAddProgramming}>Add New Schedule</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Film Form Dialog */}
      <Dialog open={showFilmForm} onOpenChange={setShowFilmForm}>
        <DialogContent className="sm:max-w-[600px]">
          <FilmForm 
            film={selectedFilm} 
            onSuccess={() => setShowFilmForm(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Programming Form Dialog */}
      <Dialog open={showProgrammingForm} onOpenChange={setShowProgrammingForm}>
        <DialogContent className="sm:max-w-[600px]">
          <ProgrammingForm 
            programming={selectedProgramming} 
            onSuccess={() => setShowProgrammingForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
