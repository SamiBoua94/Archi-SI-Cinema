import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { insertProgrammationSchema, Programmation, Film } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";

interface ProgrammingFormProps {
  programming?: Programmation | null;
  onSuccess?: () => void;
}

// Extend schema for the form
const programmingFormSchema = insertProgrammationSchema
  .omit({ cinemaid: true })
  .extend({
    date_debut: z.date({
      required_error: "Start date is required",
    }),
    date_fin: z.date({
      required_error: "End date is required",
    }),
  })
  .refine((data) => data.date_fin >= data.date_debut, {
    message: "End date must be after start date",
    path: ["date_fin"],
  });

type ProgrammingFormValues = z.infer<typeof programmingFormSchema>;

// Day options
const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ProgrammingForm({ programming, onSuccess }: ProgrammingFormProps) {
  const { toast } = useToast();
  const isEditing = !!programming;
  
  // Fetch films for dropdown
  const { data: filmsData, isLoading: isLoadingFilms } = useQuery<{ data: { films: Film[] } }>({
    queryKey: ["/api/films"],
  });
  
  const form = useForm<ProgrammingFormValues>({
    resolver: zodResolver(programmingFormSchema),
    defaultValues: isEditing
      ? {
          filmid: programming.filmid,
          date_debut: new Date(programming.date_debut),
          date_fin: new Date(programming.date_fin),
          jour_1: programming.jour_1,
          jour_2: programming.jour_2,
          jour_3: programming.jour_3,
          heure_debut: programming.heure_debut,
        }
      : {
          filmid: 0,
          date_debut: new Date(),
          date_fin: new Date(new Date().setDate(new Date().getDate() + 30)), // Default to 30 days later
          jour_1: "Monday",
          jour_2: "Wednesday",
          jour_3: "Friday",
          heure_debut: "19:30",
        },
  });
  
  const mutation = useMutation({
    mutationFn: async (data: ProgrammingFormValues) => {
      // Convert dates to string format for API
      const apiData = {
        ...data,
        date_debut: format(data.date_debut, "yyyy-MM-dd"),
        date_fin: format(data.date_fin, "yyyy-MM-dd"),
      };
      
      if (isEditing) {
        await apiRequest("PUT", `/api/programmations/${programming.id}`, apiData);
      } else {
        await apiRequest("POST", "/api/programmations", apiData);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Schedule updated" : "Schedule created",
        description: isEditing 
          ? "The schedule has been updated successfully." 
          : "The new schedule has been added successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/programmations"] });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} schedule: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: ProgrammingFormValues) {
    mutation.mutate(data);
  }
  
  return (
    <Form {...form}>
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Schedule" : "Add New Schedule"}</h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="filmid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Film</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a film" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingFilms ? (
                    <SelectItem value="loading" disabled>
                      Loading films...
                    </SelectItem>
                  ) : (
                    filmsData?.data?.films.map((film) => (
                      <SelectItem key={film.id} value={film.id.toString()}>
                        {film.titre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_debut"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date_fin"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="jour_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Day</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dayOptions.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="jour_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Second Day</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dayOptions.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="jour_3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Third Day</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dayOptions.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="heure_debut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 19:30" {...field} />
              </FormControl>
              <FormDescription>
                Enter the time in 24-hour format (e.g., 14:30, 19:45)
              </FormDescription>
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
            {isEditing ? "Update Schedule" : "Create Schedule"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
