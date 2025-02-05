import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function PatientRecords() {
  const { user } = useAuth();

  const { data: records, isLoading } = useQuery({
    queryKey: [`/api/records/${user?.id}`],
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Medical Records</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : records?.length ? (
            <div className="space-y-6">
              {records.map((record: any) => (
                <Card key={record.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          Diagnosis: {record.diagnosis}
                        </CardTitle>
                        <CardDescription>
                          Dr. {record.doctor.fullName} •{" "}
                          {format(new Date(record.createdAt), "PPP")}
                        </CardDescription>
                      </div>
                      {record.attachments?.length > 0 && (
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Attachments
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {record.prescription && (
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Prescription</h3>
                        <p className="text-muted-foreground">
                          {record.prescription}
                        </p>
                      </div>
                    )}
                    {record.notes && (
                      <div>
                        <h3 className="font-semibold mb-2">Notes</h3>
                        <p className="text-muted-foreground">{record.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No medical records found
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}