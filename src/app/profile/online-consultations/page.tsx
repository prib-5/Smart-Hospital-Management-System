
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";

export default function MyOnlineConsultationsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3">
          <Video className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl text-primary">My Online Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">Manage your scheduled online consultations and view past consultation details.</p>
          {/* Placeholder content */}
          <div className="mt-6 p-4 border rounded-md bg-secondary/10">
            <h3 className="font-semibold text-primary">Next Online Consultation:</h3>
            <p>Dr. Sarah Lee - Neurology</p>
            <p>Date: November 05, 2024 at 02:00 PM</p>
            <p className="text-sm text-muted-foreground"><a href="#" className="text-primary hover:underline">Join Meeting</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
