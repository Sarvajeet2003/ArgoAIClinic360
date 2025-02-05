import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { FiUser, FiLock } from "react-icons/fi";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">("patient");

  const loginForm = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      fullName: "",
      specialization: "",
    },
  });

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Clinic360
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form
                  onSubmit={loginForm.handleSubmit((data) =>
                    loginMutation.mutate(data)
                  )}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3 text-gray-400" />
                      <Input
                        {...loginForm.register("username")}
                        className="pl-10"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-3 text-gray-400" />
                      <Input
                        {...loginForm.register("password")}
                        type="password"
                        className="pl-10"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form
                  onSubmit={registerForm.handleSubmit((data) =>
                    registerMutation.mutate({
                      ...data,
                      role: selectedRole,
                    })
                  )}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Button
                      type="button"
                      variant={selectedRole === "patient" ? "default" : "outline"}
                      onClick={() => setSelectedRole("patient")}
                    >
                      Patient
                    </Button>
                    <Button
                      type="button"
                      variant={selectedRole === "doctor" ? "default" : "outline"}
                      onClick={() => setSelectedRole("doctor")}
                    >
                      Doctor
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      {...registerForm.register("fullName")}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      {...registerForm.register("email")}
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>

                  {selectedRole === "doctor" && (
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        {...registerForm.register("specialization")}
                        placeholder="Enter your specialization"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      {...registerForm.register("username")}
                      placeholder="Choose a username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      {...registerForm.register("password")}
                      type="password"
                      placeholder="Choose a password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-500 to-teal-500 items-center justify-center text-white p-12">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-6">
            Welcome to Clinic360
          </h1>
          <p className="text-lg opacity-90 mb-8">
            A modern healthcare platform that connects patients with doctors,
            manages medical records, and streamlines appointment booking.
          </p>
          <div className="grid grid-cols-2 gap-6 text-sm opacity-75">
            <div>
              <h3 className="font-semibold mb-2">For Patients</h3>
              <ul className="space-y-2">
                <li>• Easy appointment booking</li>
                <li>• Access to medical records</li>
                <li>• Secure communication</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Doctors</h3>
              <ul className="space-y-2">
                <li>• Efficient schedule management</li>
                <li>• Digital record keeping</li>
                <li>• Patient history tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
