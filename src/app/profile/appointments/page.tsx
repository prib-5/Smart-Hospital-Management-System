
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, User, Briefcase, Clock, Mail, Phone, FileText, Loader2 } from "lucide-react";
import type { Appointment, AuthenticatedUser } from '@/types';
// Changed import from firebase-data-service to hospital service
import { getAppointmentsForPatient, getAppointmentsForDoctor } from '@/services/hospital';
import { format } from 'date-fns';

export default function MyAppointmentsPage() {
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async (user: AuthenticatedUser) => {
      setIsLoading(true);
      try {
        let appointments: Appointment[] = [];
        if (user.role === 'patient') {
          // Use mock getAppointmentsForPatient
          appointments = await getAppointmentsForPatient(user.email);
        } else if (user.role === 'doctor') {
          // Use mock getAppointmentsForDoctor
          appointments = await getAppointmentsForDoctor(user.id);
        }
        setUserAppointments(appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        // Optionally set an error state and display a message
      }
      setIsLoading(false);
    };

    const storedUser = localStorage.getItem('authUser_medibook');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthenticatedUser;
        setCurrentUser(parsedUser);
        fetchAppointments(parsedUser);
      } catch (error) {
        console.error("Error processing user data for appointments:", error);
        setIsLoading(false);
      }
    } else {
        setIsLoading(false); // No user, so not loading appointments
    }
  }, []);

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-4 shadow-md bg-secondary/10">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <CalendarCheck className="mr-2 h-6 w-6" />
          Appointment on {format(new Date(appointment.date), 'PPP')} {/* Ensure date is Date object */}
        </CardTitle>
        <CardDescription>
          Time: {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center">
          <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" /> 
          <p><strong>Department:</strong> {appointment.departmentName}</p>
        </div>
        {currentUser?.role === 'patient' && (
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5 text-muted-foreground" />
            <p><strong>Doctor:</strong> {appointment.doctorName}</p>
          </div>
        )}
        {currentUser?.role === 'doctor' && (
          <>
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-muted-foreground" />
              <p><strong>Patient:</strong> {appointment.patientName}</p>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
              <p><strong>Patient Email:</strong> {appointment.patientEmail}</p>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
              <p><strong>Patient Phone:</strong> {appointment.patientPhone}</p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">View Details</Button> 
      </CardFooter>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }
  
  if (!currentUser) {
     return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl text-muted-foreground">Please log in to view your appointments.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3">
          <CalendarCheck className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl text-primary">My Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {userAppointments.length > 0 ? (
            userAppointments
              .map(appt => ({ ...appt, date: new Date(appt.date) })) // Ensure date is a Date object
              .sort((a,b) => a.date.getTime() - b.date.getTime())
              .map(appt => <AppointmentCard key={appt.id} appointment={appt} />)
          ) : (
            <div className="text-center py-10">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">You have no scheduled appointments.</p>
              {currentUser?.role === 'patient' && (
                 <Button onClick={() => window.location.href='/'} className="mt-6">Book an Appointment</Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
