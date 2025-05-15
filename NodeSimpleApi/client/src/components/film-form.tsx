import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertFilmSchema, Film } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface FilmFormProps {
  film?: Film | null;
  onSuccess?: () => void;
}

// Extend the schema for the form
const filmFormSchema = insertFilmSchema.extend({
  genres: z.string().optional(),
  synopsis: z.string().optional(),
});

type FilmFormValues = z.infer<typeof filmFormSchema>;

export default function FilmForm({ film, onSuccess }: FilmFormProps) {
  const { toast } = useToast();
  const isEditing = !!film;
  
  const form = useForm<FilmFormValues>({
    resolver: zodResolver(filmFormSchema),
    defaultValues: isEditing
      ? {
          titre: film.titre,
          duree: film.duree,
          langue: film.langue,
          sous_titres: film.sous_titres || false,
          realisateur: film.realisateur,
          acteurs_principaux: film.acteurs_principaux,
          synopsis: film.synopsis || "",
          age_minimum: film.age_minimum,
          genres: film.genres || "",
        }
      : {
          titre: "",
          duree: 90,
          langue: "French",
          sous_titres: false,
          realisateur: "",
          acteurs_principaux: "",
          synopsis: "",
          age_minimum: "All",
          genres: "",
        },
  });
  
  const mutation = useMutation({
    mutationFn: async (data: FilmFormValues) => {
      if (isEditing) {
        await apiRequest("PUT", `/api/films/${film.id}`, data);
      } else {
        await apiRequest("POST", "/api/films", data);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Film updated" : "Film created",
        description: isEditing 
          ? "The film has been updated successfully." 
          : "The new film has been added successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/films"] });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} film: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: FilmFormValues) {
    mutation.mutate(data);
  }
  
  return (
    <Form {...form}>
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Film" : "Add New Film"}</h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="titre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Film title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="age_minimum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age Rating</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. All, 12+, 16+" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="langue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. French, English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sous_titres"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Subtitles</FormLabel>
                  <FormDescription>
                    Does this film have subtitles?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="realisateur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Director</FormLabel>
              <FormControl>
                <Input placeholder="Film director" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="acteurs_principaux"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Actors</FormLabel>
              <FormControl>
                <Input placeholder="Main actors, separated by commas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genres</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Comedy, Drama, Action" {...field} />
              </FormControl>
              <FormDescription>
                Separate multiple genres with commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="synopsis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Synopsis</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of the film"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Cancel
          </Button>
          
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? "Update Film" : "Create Film"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
