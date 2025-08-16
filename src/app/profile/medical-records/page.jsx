
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function MyMedicalRecordsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl text-primary">My Medical Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">Access your medical history, prescriptions, and other health records securely.</p>
          {/* Placeholder content */}
          <div className="mt-6 p-4 border rounded-md bg-secondary/10">
            <h3 className="font-semibold text-primary">Record Summary:</h3>
            <p>Last Consultation: Dr. John Smith - October 15, 2024</p>
            <p>Prescription: Amoxicillin 250mg</p>
            <p className="text-sm text-muted-foreground"><a href="#" className="text-primary hover:underline">View Full Record (PDF)</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
