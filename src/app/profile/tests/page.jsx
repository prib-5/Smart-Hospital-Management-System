
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

export default function MyTestsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3">
          <FlaskConical className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl text-primary">My Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">View your lab test results and upcoming test appointments here.</p>
          {/* Placeholder content */}
           <div className="mt-6 p-4 border rounded-md bg-secondary/10">
            <h3 className="font-semibold text-primary">Recent Test Result:</h3>
            <p>Blood Sugar Test - Result: Normal</p>
            <p>Date: October 20, 2024</p>
            <p className="text-sm text-muted-foreground">Status: Available</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
