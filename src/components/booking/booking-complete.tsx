'use client';

import type { BookingData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CalendarPlus } from 'lucide-react';
import { format } from 'date-fns';

interface BookingCompleteProps {
  bookingData: BookingData;
  onBookAnother: () => void;
}

export function BookingComplete({ bookingData, onBookAnother }: BookingCompleteProps) {
  const { department, doctor, date, timeSlot, patientName } = bookingData;

  if (!department || !doctor || !date || !timeSlot || !patientName) {
    // This should ideally not happen if navigation is correct
    return <p>Booking information is incomplete. Something went wrong.</p>;
  }

  return (
    <Card className="shadow-lg text-center">
      <CardHeader>
        <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
           <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <CardTitle className="text-3xl text-primary mt-4">Appointment Confirmed!</CardTitle>
        <CardDescription className="text-lg">
          Thank you, {patientName}. Your appointment has been successfully booked.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">A confirmation email and SMS (if applicable) have been sent with your appointment details.</p>
        <Card className="text-left p-4 bg-secondary/20">
            <p><strong>Doctor:</strong> {doctor.name}</p>
            <p><strong>Department:</strong> {department.name}</p>
            <p><strong>Date:</strong> {format(date, 'EEEE, MMMM dd, yyyy')}</p>
            <p><strong>Time:</strong> {timeSlot.startTime} - {timeSlot.endTime}</p>
        </Card>
        <Button onClick={onBookAnother} className="mt-6 bg-primary hover:bg-primary/90">
          <CalendarPlus className="mr-2 h-5 w-5" /> Book Another Appointment
        </Button>
      </CardContent>
    </Card>
  );
}
