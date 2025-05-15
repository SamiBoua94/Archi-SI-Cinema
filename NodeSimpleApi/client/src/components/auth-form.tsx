import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

type AuthFormProps = {
  type: "login" | "register";
};

const loginSchema = z.object({
  login: z.string().min(1, "Login is required"),
  mot_de_passe: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  nom: z.string().min(1, "Cinema name is required"),
  adresse: z.string().min(1, "Address is required"),
  ville: z.string().min(1, "City is required"),
  login: z.string().min(3, "Login must be at least 3 characters"),
  mot_de_passe: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
});

export default function AuthForm({ type }: AuthFormProps) {
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const schema = type === "login" ? loginSchema : registerSchema;
  type FormValues = z.infer<typeof schema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: type === "login"
      ? { login: "", mot_de_passe: "" }
      : { nom: "", adresse: "", ville: "", login: "", mot_de_passe: "", email: "" },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (type === "login") {
      loginMutation.mutate(values as { login: string; mot_de_passe: string }, {
        onSuccess: () => {
          navigate("/dashboard");
        }
      });
    } else {
      try {
        setIsRegistering(true);
        // Register new cinema
        const registrationResponse = await apiRequest("POST", "/api/cinemas", values);
        const data = await registrationResponse.json();
        
        toast({
          title: "Registration successful",
          description: "Your cinema has been registered. Please log in.",
        });
        
        // Auto-login after registration
        loginMutation.mutate(
          { login: values.login, mot_de_passe: values.mot_de_passe },
          {
            onSuccess: () => {
              navigate("/dashboard");
            },
          }
        );
      } catch (error) {
        toast({
          title: "Registration failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setIsRegistering(false);
      }
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {type === "register" && (
          <>
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cinema Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Gaumont Opéra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="2 Rue des Capucines" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ville"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@cinema.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input placeholder="cinema_username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mot_de_passe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loginMutation.isPending || isRegistering}
        >
          {(loginMutation.isPending || isRegistering) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {type === "login" ? "Login" : "Register"}
        </Button>
      </form>
    </Form>
  );
}
