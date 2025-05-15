import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { MovieWithSchedule } from "@/lib/types";

// Extended schema for the movie form
const movieFormSchema = z.object({
  // Movie details
  title: z.string().min(1, "Title is required"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  language: z.string().min(1, "Language is required"),
  subtitles: z.boolean().default(false),
  director: z.string().min(1, "Director is required"),
  actors: z.string().min(1, "At least one actor is required"),
  ageRating: z.string().min(1, "Age rating is required"),
  synopsis: z.string().optional(),
  genres: z.string().optional(),
  poster: z.string().url("Please enter a valid URL").default("https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=750"),
  
  // Schedule details
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  monday: z.boolean().default(false),
  tuesday: z.boolean().default(false),
  wednesday: z.boolean().default(false),
  thursday: z.boolean().default(false),
  friday: z.boolean().default(false),
  saturday: z.boolean().default(false),
  sunday: z.boolean().default(false),
  
  // Showtimes
  showtimes: z.array(z.string()).min(1, "At least one showtime is required"),
}).refine(data => {
  const daysSelected = [
    data.monday, data.tuesday, data.wednesday, data.thursday,
    data.friday, data.saturday, data.sunday
  ].filter(Boolean).length;
  
  return daysSelected === 3;
}, {
  message: "Please select exactly 3 days",
  path: ["monday"], // We'll show the error on the first day checkbox
});

type MovieFormValues = z.infer<typeof movieFormSchema>;

interface MovieFormProps {
  movieId?: string;
}

export function MovieForm({ movieId }: MovieFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(!!movieId);

  // Fetch movie data if editing
  const { data: movieData, isLoading: isLoadingMovie } = useQuery<MovieWithSchedule>({
    queryKey: isEditing ? [`/api/movies/${movieId}`] : [],
    enabled: isEditing,
  });

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      title: "",
      duration: 90,
      language: "",
      subtitles: false,
      director: "",
      actors: "",
      ageRating: "",
      synopsis: "",
      genres: "",
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=750",
      startDate: "",
      endDate: "",
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      showtimes: ["14:00"],
    },
  });

  // Populate form when editing and data is loaded
  useEffect(() => {
    if (isEditing && movieData) {
      const schedule = movieData.schedule;
      
      // Format dates for the form
      const formatDateForInput = (date: Date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      };
      
      form.reset({
        title: movieData.title,
        duration: movieData.duration,
        language: movieData.language,
        subtitles: movieData.subtitles,
        director: movieData.director,
        actors: movieData.actors,
        ageRating: movieData.ageRating,
        synopsis: movieData.synopsis || "",
        genres: movieData.genres || "",
        poster: movieData.poster,
        startDate: formatDateForInput(schedule.startDate),
        endDate: formatDateForInput(schedule.endDate),
        monday: schedule.monday,
        tuesday: schedule.tuesday,
        wednesday: schedule.wednesday,
        thursday: schedule.thursday,
        friday: schedule.friday,
        saturday: schedule.saturday,
        sunday: schedule.sunday,
        showtimes: schedule.showtimes.map(st => st.startTime),
      });
    }
  }, [isEditing, movieData, form]);

  // Add movie mutation
  const addMovieMutation = useMutation({
    mutationFn: async (data: MovieFormValues) => {
      // Separate data into movie, schedule, and showtimes
      const { 
        title, duration, language, subtitles, director, 
        actors, synopsis, ageRating, genres, poster,
        startDate, endDate, monday, tuesday, wednesday, 
        thursday, friday, saturday, sunday, showtimes 
      } = data;
      
      const movieData = {
        title, duration, language, subtitles, director, 
        actors, synopsis, ageRating, genres, poster
      };
      
      const scheduleData = {
        startDate, endDate, monday, tuesday, wednesday, 
        thursday, friday, saturday, sunday
      };
      
      return apiRequest("POST", "/api/theater/movies", {
        movie: movieData,
        schedule: scheduleData,
        showtimes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/theater/movies"] });
      toast({
        title: "Success",
        description: "Movie added successfully",
      });
      navigate("/theater/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add movie",
        variant: "destructive",
      });
    },
  });

  // Update movie mutation
  const updateMovieMutation = useMutation({
    mutationFn: async (data: MovieFormValues) => {
      // Separate data into movie and schedule
      const { 
        title, duration, language, subtitles, director, 
        actors, synopsis, ageRating, genres, poster,
        startDate, endDate, monday, tuesday, wednesday, 
        thursday, friday, saturday, sunday, showtimes 
      } = data;
      
      const movieData = {
        title, duration, language, subtitles, director, 
        actors, synopsis, ageRating, genres, poster
      };
      
      const scheduleData = {
        startDate, endDate, monday, tuesday, wednesday, 
        thursday, friday, saturday, sunday
      };
      
      return apiRequest("PUT", `/api/theater/movies/${movieId}`, {
        movie: movieData,
        schedule: scheduleData,
        showtimes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/theater/movies"] });
      queryClient.invalidateQueries({ queryKey: [`/api/movies/${movieId}`] });
      toast({
        title: "Success",
        description: "Movie updated successfully",
      });
      navigate("/theater/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update movie",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MovieFormValues) => {
    if (isEditing) {
      updateMovieMutation.mutate(data);
    } else {
      addMovieMutation.mutate(data);
    }
  };

  // Add a new showtime field
  const addShowtime = () => {
    const currentShowtimes = form.getValues().showtimes;
    form.setValue("showtimes", [...currentShowtimes, ""]);
  };

  // Remove a showtime field
  const removeShowtime = (index: number) => {
    const currentShowtimes = form.getValues().showtimes;
    if (currentShowtimes.length > 1) {
      form.setValue(
        "showtimes",
        currentShowtimes.filter((_, i) => i !== index)
      );
    }
  };

  if (isEditing && isLoadingMovie) {
    return <div className="text-center p-8">Loading movie data...</div>;
  }

  return (
    <>
      <div className="mb-4">
        <Button
          variant="ghost"
          className="text-[#E50914] hover:text-[#E50914]/80 p-0"
          onClick={() => navigate("/theater/dashboard")}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold font-['Montserrat'] text-[#333333] mb-6">
            {isEditing ? "Edit Movie" : "Add New Movie"}
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Movie Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter movie title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter duration in minutes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Language *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Italian">Italian</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitles"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Subtitles</FormLabel>
                        <p className="text-sm text-gray-500">
                          Movie has French subtitles
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="director"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Director *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter director's name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="actors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Actors *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter main actors (comma separated)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ageRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Rating *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="All">All Ages</SelectItem>
                          <SelectItem value="10+">10+</SelectItem>
                          <SelectItem value="12+">12+</SelectItem>
                          <SelectItem value="16+">16+</SelectItem>
                          <SelectItem value="18+">18+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poster"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Movie Poster URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter URL for movie poster"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold font-['Montserrat'] mb-4">
                  Schedule Information
                </h3>

                <div className="space-y-4">
                  <FormLabel>
                    Showing Days (select 3) *
                  </FormLabel>
                  <FormMessage>
                    {form.formState.errors.monday?.message}
                  </FormMessage>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    <FormField
                      control={form.control}
                      name="monday"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Monday</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tuesday"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Tuesday</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="wednesday"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Wednesday</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="thursday"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Thursday</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="friday"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Friday</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="saturday"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Saturday</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sunday"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Sunday</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <FormLabel>Showtimes *</FormLabel>
                  <FormMessage>
                    {form.formState.errors.showtimes?.message}
                  </FormMessage>
                  <div className="space-y-3">
                    {form.watch("showtimes").map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`showtimes.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  type="time"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {form.watch("showtimes").length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeShowtime(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addShowtime}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Showtime
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold font-['Montserrat'] mb-4">
                  Additional Information
                </h3>

                <FormField
                  control={form.control}
                  name="synopsis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Synopsis</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter movie synopsis"
                          rows={4}
                          {...field}
                        />
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
                        <Input
                          placeholder="Enter genres (e.g. Drama, Comedy, Action)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/theater/dashboard")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addMovieMutation.isPending || updateMovieMutation.isPending}
                  className="bg-[#E50914] hover:bg-[#E50914]/90 text-white"
                >
                  {isEditing ? "Update Movie" : "Add Movie"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
