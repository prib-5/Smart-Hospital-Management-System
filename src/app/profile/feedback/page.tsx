
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export default function MyFeedbackPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3">
          <Star className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl text-primary">My Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">Share your experience or submit feedback about our services.</p>
          <div>
            <label htmlFor="feedback-message" className="block text-sm font-medium text-foreground mb-1">Your Feedback</label>
            <Textarea id="feedback-message" placeholder="Tell us about your experience..." rows={5} />
          </div>
          <Button className="bg-primary hover:bg-primary/90">Submit Feedback</Button>
          
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-semibold text-primary mb-2">Previously Submitted Feedback</h3>
            <div className="p-4 border rounded-md bg-secondary/10">
              <p className="italic">"Great service from Dr. Carter. The booking process was very smooth."</p>
              <p className="text-sm text-muted-foreground">- Submitted on October 10, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
