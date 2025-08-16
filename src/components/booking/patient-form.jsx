
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const patientFormSchema = z.object({
  patientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  patientEmail: z.string().email({ message: "Invalid email address." }),
  patientPhone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-]+$/, { message: "Invalid phone number format." }),
});


export function PatientForm({ department, doctor, date, timeSlot, onSubmitPatientInfo, onBack }) {
  const form = useForm({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      patientName: '',
      patientEmail: '',
      patientPhone: '',
    },
  });

  const appointmentDetails = `Appointment with ${doctor.name} (${department.name}) on ${format(date, 'PPP')} at ${timeSlot.startTime}.`;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-primary">Enter Your Details</CardTitle>
            <Button variant="outline" size="sm" onClick={onBack} aria-label="Go back to time slot selection">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        </div>
        <CardDescription>{appointmentDetails}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitPatientInfo)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g., +1 555-123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Proceed to Confirmation</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
