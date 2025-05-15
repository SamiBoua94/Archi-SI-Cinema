import { Film } from "@shared/schema";
import { Button } from "@/components/ui/button";
import MovieCard from "@/components/movie-card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface MovieListProps {
  films: Film[];
  onEditFilm?: (film: Film) => void;
  mode: "manage" | "browse";
}

export default function MovieList({ films, onEditFilm, mode }: MovieListProps) {
  const [filmToDelete, setFilmToDelete] = useState<Film | null>(null);
  const { toast } = useToast();
  
  const deleteFilmMutation = useMutation({
    mutationFn: async (filmId: number) => {
      await apiRequest("DELETE", `/api/films/${filmId}`);
    },
    onSuccess: () => {
      toast({
        title: "Film deleted",
        description: "The film has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/films"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete film: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteFilm = (film: Film) => {
    setFilmToDelete(film);
  };
  
  const confirmDelete = () => {
    if (filmToDelete) {
      deleteFilmMutation.mutate(filmToDelete.id);
      setFilmToDelete(null);
    }
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {films.map((film) => (
          <div key={film.id} className="relative">
            <MovieCard film={film} />
            
            {mode === "manage" && (
              <div className="absolute top-2 right-2 flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => onEditFilm && onEditFilm(film)}
                >
                  Edit
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteFilm(film)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {films.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No films found</p>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!filmToDelete} onOpenChange={(open) => !open && setFilmToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the film "{filmToDelete?.titre}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
