import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ClipboardList } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: appointments, isLoading: isLoadingAppointments } = useQuery<any[]>({
    queryKey: ["/api/appointments"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              {isLoadingAppointments ? (
                <Skeleton className="h-9 w-64" />
              ) : (
                `Welcome back, ${user?.fullName}`
              )}
            </h1>
            <p className="text-muted-foreground">
              Manage your healthcare journey from one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <CardTitle>Upcoming Appointments</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingAppointments ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : appointments?.length ? (
                  <ul className="space-y-3">
                    {appointments.slice(0, 3).map((apt: any) => (
                      <li
                        key={apt.id}
                        className="flex items-center text-sm border-l-2 border-primary pl-3"
                      >
                        <div>
                          <p className="font-medium">
                            {new Date(apt.startTime).toLocaleDateString()}
                          </p>
                          <p className="text-muted-foreground">
                            {user?.role === "patient"
                              ? `with Dr. ${apt.doctor.fullName}`
                              : `with ${apt.patient.fullName}`}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No upcoming appointments scheduled
                  </p>
                )}
              </CardContent>
            </Card>

            {user?.role === "patient" && (
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <CardTitle>Recent Records</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      View your medical history, prescriptions, and test results
                    </p>
                    <div className="pt-2">
                      <a
                        href="/records"
                        className="text-sm text-primary hover:underline"
                      >
                        View all records →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}