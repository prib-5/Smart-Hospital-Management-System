'use client';

import type { BookingData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle, User, Briefcase, CalendarDays, Clock, Mail, Phone } from 'lucide-react';

interface ConfirmationStepProps {
  bookingData: BookingData;
  onConfirmBooking: () => void;
  onBack: () => void;
  isBooking: boolean;
}

export function ConfirmationStep({ bookingData, onConfirmBooking, onBack, isBooking }: ConfirmationStepProps) {
  const { department, doctor, date, timeSlot, patientName, patientEmail, patientPhone } = bookingData;

  if (!department || !doctor || !date || !timeSlot || !patientName || !patientEmail || !patientPhone) {
    return <p>Missing booking information. Please go back and complete all steps.</p>;
  }
  
  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-start space-x-3">
      <Icon className="h-5 w-5 text-secondary mt-1" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-primary">Confirm Your Appointment</CardTitle>
            <Button variant="outline" size="sm" onClick={onBack} disabled={isBooking} aria-label="Go back to patient information">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        </div>
        <CardDescription>Please review your appointment details below before confirming.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">Appointment Details</h3>
            <DetailItem icon={Briefcase} label="Department" value={department.name} />
            <DetailItem icon={User} label="Doctor" value={doctor.name} />
            <DetailItem icon={CalendarDays} label="Date" value={format(date, 'EEEE, MMMM dd, yyyy')} />
            <DetailItem icon={Clock} label="Time" value={`${timeSlot.startTime} - ${timeSlot.endTime}`} />
          </div>
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-primary border-b pb-2">Patient Information</h3>
            <DetailItem icon={User} label="Full Name" value={patientName} />
            <DetailItem icon={Mail} label="Email" value={patientEmail} />
            <DetailItem icon={Phone} label="Phone" value={patientPhone} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onConfirmBooking} 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isBooking}
        >
          {isBooking ? 'Booking...' : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" /> Confirm & Book Appointment
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
