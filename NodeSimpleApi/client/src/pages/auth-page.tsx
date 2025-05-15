import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import AuthForm from "@/components/auth-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  const { cinema, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (cinema && !isLoading) {
      setLocation("/dashboard");
    }
  }, [cinema, isLoading, setLocation]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Cinema Owner Access</CardTitle>
            <CardDescription className="text-center">
              Login or register to manage your cinema's films and schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <AuthForm type="login" />
              </TabsContent>
              <TabsContent value="register">
                <AuthForm type="register" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-md px-4 mt-8 md:mt-0">
        <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">CinéAPI Platform</h2>
          <p className="mb-4">
            The ultimate platform for Parisian movie theaters to showcase their films and programming.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className="bg-white/20 p-2 rounded-full mt-1">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Manage Films</h3>
                <p className="text-sm opacity-90">Add and update your cinema's film catalog</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-white/20 p-2 rounded-full mt-1">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Create Schedules</h3>
                <p className="text-sm opacity-90">Set up screening times and days for your films</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-white/20 p-2 rounded-full mt-1">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Analytics Dashboard</h3>
                <p className="text-sm opacity-90">View performance metrics for your cinema</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
