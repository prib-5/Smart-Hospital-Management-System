
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";

export default function MyMedicineOrdersPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3">
          <Pill className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl text-primary">My Medicine Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">Track your medicine orders and view your order history.</p>
          {/* Placeholder content */}
          <div className="mt-6 p-4 border rounded-md bg-secondary/10">
            <h3 className="font-semibold text-primary">Recent Order:</h3>
            <p>Order ID: #12345 - Paracetamol, Vitamin C</p>
            <p>Date: October 22, 2024</p>
            <p className="text-sm text-muted-foreground">Status: Delivered</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
