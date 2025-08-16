
'use client';

import { useState, useEffect } from 'react';
import type { Department, Doctor, TimeSlot, BookingData, BookingStep as StepEnum, AuthenticatedUser } from '@/types';
import { BookingStep } from '@/types'; 
import { SearchMethodSelector } from '@/components/booking/search-method-selector';
import { DepartmentSelector } from '@/components/booking/department-selector';
import { DoctorSelector } from '@/components/booking/doctor-selector';
import { AppointmentScheduler } from '@/components/booking/appointment-scheduler';
import { PatientForm } from '@/components/booking/patient-form';
import { ConfirmationStep } from '@/components/booking/confirmation-step';
import { BookingComplete } from '@/components/booking/booking-complete';
import { ProgressIndicator } from '@/components/booking/progress-indicator';
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from '@/services/email';
// Changed import from firebase-data-service to hospital service
import { bookTimeSlot, getDepartmentById, unknownDepartment } from '@/services/hospital'; 
import { format } from 'date-fns';
import MyAppointmentsPage from '@/app/profile/appointments/page';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<StepEnum>(BookingStep.CHOOSE_SEARCH_METHOD);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [isBooking, setIsBooking] = useState(false);
  const [isNearMeFlow, setIsNearMeFlow] = useState(false);
  const { toast } = useToast();

  const [authUser, setAuthUser] = useState<AuthenticatedUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser_medibook');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthenticatedUser;
        setAuthUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user data for page:", error);
        localStorage.removeItem('authUser_medibook');
      }
    }
    setIsLoadingAuth(false);
  }, []);

  useEffect(() => {
    if (currentStep === BookingStep.SELECT_DOCTOR && isNearMeFlow) {
      if (navigator.geolocation) {
        console.log("Attempting to get user location for 'near me' search...");
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("User location:", position.coords.latitude, position.coords.longitude);
            toast({
              title: "Location Accessed",
              description: "Showing all available doctors for this 'near me' demo.",
            });
          },
          (error) => {
            console.warn("Error getting location:", error.message);
            toast({
              title: "Location Access Denied/Failed",
              description: "Showing all available doctors. Enable location for refined results.",
              variant: "destructive",
            });
          }
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
        toast({
          title: "Location Not Supported",
          description: "Showing all available doctors.",
          variant: "destructive",
        });
      }
    }
  }, [currentStep, isNearMeFlow, toast]);

  const handleSelectSearchMethod = (method: 'department' | 'nearMe') => {
    setBookingData({}); 
    if (method === 'department') {
      setIsNearMeFlow(false);
      setCurrentStep(BookingStep.SELECT_DEPARTMENT);
    } else { 
      setIsNearMeFlow(true);
      setCurrentStep(BookingStep.SELECT_DOCTOR);
    }
  };

  const handleSelectDepartment = (department: Department) => {
    setBookingData({ department });
    setCurrentStep(BookingStep.SELECT_DOCTOR);
  };

  const handleSelectDoctor = async (doctor: Doctor) => {
    let departmentForDoctor = bookingData.department;
    if (!departmentForDoctor) { 
      // Use mock getDepartmentById
      const fetchedDept = await getDepartmentById(doctor.departmentId);
      departmentForDoctor = fetchedDept || { ...unknownDepartment, name: `Dept. for ${doctor.name}`};
    }
    setBookingData(prev => ({ ...prev, doctor, department: departmentForDoctor }));
    setCurrentStep(BookingStep.SELECT_DATE_TIME);
  };

  const handleSelectSlot = (date: Date, timeSlot: TimeSlot) => {
    setBookingData(prev => ({ ...prev, date, timeSlot }));
    setCurrentStep(BookingStep.PATIENT_INFO);
  };

  const handleSubmitPatientInfo = (patientInfo: { patientName: string; patientEmail: string; patientPhone: string; }) => {
    setBookingData(prev => ({ ...prev, ...patientInfo }));
    setCurrentStep(BookingStep.CONFIRMATION);
  };

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    if (!bookingData.doctor || !bookingData.date || !bookingData.timeSlot || !bookingData.patientEmail || !bookingData.patientPhone || !bookingData.patientName || !bookingData.department) {
      toast({
        title: "Error",
        description: "Missing booking information. Please start over.",
        variant: "destructive",
      });
      setIsBooking(false);
      setCurrentStep(BookingStep.CHOOSE_SEARCH_METHOD); 
      setBookingData({});
      return;
    }
    
    try {
      // Use mock bookTimeSlot
      const bookedSuccessfully = await bookTimeSlot(
        bookingData.department, 
        bookingData.doctor, 
        bookingData.date, 
        bookingData.timeSlot,
        bookingData.patientName,
        bookingData.patientEmail,
        bookingData.patientPhone
      );

      if (!bookedSuccessfully) {
        toast({
          title: "Booking Failed",
          description: "The selected time slot may no longer be available. Please choose another slot.",
          variant: "destructive",
        });
        setIsBooking(false);
        setCurrentStep(BookingStep.SELECT_DATE_TIME); 
        setBookingData(prev => ({ ...prev, timeSlot: undefined })); 
        return;
      }

      const subject = `Appointment Confirmation: ${bookingData.doctor.name} on ${format(bookingData.date, 'PPP')}`;
      const body = `Dear ${bookingData.patientName},\n\nYour appointment with ${bookingData.doctor.name} (${bookingData.department.name}) is confirmed for ${format(bookingData.date, 'EEEE, MMMM dd, yyyy')} at ${bookingData.timeSlot.startTime}.\n\nThank you for using MediBook.`;
      
      await sendEmail(bookingData.patientEmail, subject, body);
      
      toast({
        title: "Appointment Booked!",
        description: "Confirmation details sent to your email.",
        variant: "default",
        className: "bg-green-500 text-white",
      });
      setCurrentStep(BookingStep.COMPLETED);

    } catch (error) {
      console.error("Failed to book or send notifications:", error);
      toast({
        title: "Booking Error",
        description: "An error occurred during booking. Please try again or contact support.",
        variant: "destructive",
      });
       setCurrentStep(BookingStep.SELECT_DATE_TIME); 
       setBookingData(prev => ({ ...prev, timeSlot: undefined })); 
    } finally {
      setIsBooking(false);
    }
  };

 const handleBack = () => {
    if (currentStep === BookingStep.COMPLETED) return;

    let newStep = currentStep;
    let newBookingData = { ...bookingData };

    switch (currentStep) {
      case BookingStep.SELECT_DEPARTMENT:
        newStep = BookingStep.CHOOSE_SEARCH_METHOD;
        newBookingData = { department: undefined, doctor: undefined, date: undefined, timeSlot: undefined };
        setIsNearMeFlow(false);
        break;
      case BookingStep.SELECT_DOCTOR:
        newStep = isNearMeFlow ? BookingStep.CHOOSE_SEARCH_METHOD : BookingStep.SELECT_DEPARTMENT;
        newBookingData = { ...bookingData, doctor: undefined, date: undefined, timeSlot: undefined };
        if(isNearMeFlow) {
          newBookingData.department = undefined; 
        }
        break;
      case BookingStep.SELECT_DATE_TIME:
        newStep = BookingStep.SELECT_DOCTOR;
        newBookingData = { ...bookingData, date: undefined, timeSlot: undefined };
        break;
      case BookingStep.PATIENT_INFO:
        newStep = BookingStep.SELECT_DATE_TIME;
        newBookingData = { ...bookingData, patientName: undefined, patientEmail: undefined, patientPhone: undefined };
        break;
      case BookingStep.CONFIRMATION:
        newStep = BookingStep.PATIENT_INFO;
        break;
      default:
        if (currentStep <= BookingStep.CHOOSE_SEARCH_METHOD) return; 
        newStep = currentStep - 1; 
        break;
    }
    
    setBookingData(newBookingData);
    setCurrentStep(newStep);
  };

  const handleBookAnother = () => {
    setBookingData({});
    setCurrentStep(BookingStep.CHOOSE_SEARCH_METHOD);
    setIsNearMeFlow(false);
  };
  
  const renderPatientBookingStep = () => {
    switch (currentStep) {
      case BookingStep.CHOOSE_SEARCH_METHOD:
        return <SearchMethodSelector onSelectMethod={handleSelectSearchMethod} />;
      case BookingStep.SELECT_DEPARTMENT:
        return <DepartmentSelector onSelectDepartment={handleSelectDepartment} onBack={handleBack} />;
      case BookingStep.SELECT_DOCTOR:
        return <DoctorSelector department={bookingData.department} onSelectDoctor={handleSelectDoctor} onBack={handleBack} />;
      case BookingStep.SELECT_DATE_TIME:
        if (!bookingData.department || !bookingData.doctor) return <p>Error: Doctor or Department not selected.</p>;
        return <AppointmentScheduler department={bookingData.department} doctor={bookingData.doctor} onSelectSlot={handleSelectSlot} onBack={handleBack} />;
      case BookingStep.PATIENT_INFO:
        if (!bookingData.department || !bookingData.doctor || !bookingData.date || !bookingData.timeSlot) return <p>Error: Appointment slot not selected.</p>;
        return <PatientForm department={bookingData.department} doctor={bookingData.doctor} date={bookingData.date} timeSlot={bookingData.timeSlot} onSubmitPatientInfo={handleSubmitPatientInfo} onBack={handleBack} />;
      case BookingStep.CONFIRMATION:
        if (!bookingData.department || !bookingData.doctor || !bookingData.date || !bookingData.timeSlot || !bookingData.patientName) return <p>Error: Incomplete information.</p>;
        return <ConfirmationStep bookingData={bookingData} onConfirmBooking={handleConfirmBooking} onBack={handleBack} isBooking={isBooking} />;
      case BookingStep.COMPLETED:
        return <BookingComplete bookingData={bookingData} onBookAnother={handleBookAnother} />;
      default:
        return <p>Unknown step.</p>;
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  if (authUser && authUser.role === 'doctor') {
    return <MyAppointmentsPage />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <ProgressIndicator currentStep={currentStep} />
      <div className="mt-8">
        {renderPatientBookingStep()}
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MediBook. All rights reserved.</p>
        <p>A demo application for hospital appointment booking.</p>
      </footer>
    </div>
  );
}
