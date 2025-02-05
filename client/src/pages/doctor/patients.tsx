import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function DoctorPatients() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const createRecord = useMutation({
    mutationFn: async () => {
      if (!selectedPatient) return;
      await apiRequest("POST", "/api/records", {
        patientId: selectedPatient.patient.id,
        diagnosis,
        prescription,
        notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/records"] });
      toast({
        title: "Success",
        description: "Medical record created successfully",
      });
      setDiagnosis("");
      setPrescription("");
      setNotes("");
      setSelectedPatient(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredAppointments = appointments?.filter(
    (apt: any) =>
      apt.patient.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      apt.reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Patients</h1>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAppointments?.length ? (
            <div className="space-y-6">
              {filteredAppointments.map((apt: any) => (
                <Card key={apt.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{apt.patient.fullName}</CardTitle>
                        <CardDescription>
                          Appointment:{" "}
                          {format(new Date(apt.startTime), "PPP 'at' p")}
                        </CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedPatient(apt)}
                            variant="outline"
                          >
                            Add Medical Record
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>New Medical Record</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Diagnosis
                              </label>
                              <Input
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="Enter diagnosis"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Prescription
                              </label>
                              <Textarea
                                value={prescription}
                                onChange={(e) => setPrescription(e.target.value)}
                                placeholder="Enter prescription details"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">Notes</label>
                              <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any additional notes"
                              />
                            </div>

                            <Button
                              className="w-full"
                              onClick={() => createRecord.mutate()}
                              disabled={
                                createRecord.isPending || !diagnosis || !prescription
                              }
                            >
                              {createRecord.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Save Record
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {apt.reason && (
                      <p className="text-muted-foreground">{apt.reason}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No patients found
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
