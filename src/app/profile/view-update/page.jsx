
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog } from "lucide-react";

export default function ViewUpdateProfilePage() {
  // In a real app, these would be form fields managed by react-hook-form
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3">
          <UserCog className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl text-primary">View / Update Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" defaultValue="Shamba Saha" />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="shamba.saha@example.com" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="+919748102685" />
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" defaultValue="1990-01-01" />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" type="text" defaultValue="123 Main St, Anytown, USA" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
