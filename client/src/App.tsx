import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import PatientRecords from "@/pages/patient/records";
import PatientAppointments from "@/pages/patient/appointments";
import DoctorSchedule from "@/pages/doctor/schedule";
import DoctorPatients from "@/pages/doctor/patients";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/records" component={PatientRecords} />
      <ProtectedRoute path="/appointments" component={PatientAppointments} />
      <ProtectedRoute path="/schedule" component={DoctorSchedule} />
      <ProtectedRoute path="/patients" component={DoctorPatients} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
