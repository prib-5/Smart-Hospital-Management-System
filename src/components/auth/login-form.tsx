
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LogIn, UserPlus, BriefcaseMedical, User, Loader2 } from 'lucide-react';
import { DoctorRegistrationForm } from './doctor-registration-form';
import type { AuthenticatedUser, UserRole } from '@/types';
// Changed import from firebase-data-service to hospital service
import { getDoctorByEmail } from '@/services/hospital';
import { useToast } from '@/hooks/use-toast';


const patientLoginFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).max(20, {message: "Username must be 20 characters or less."}),
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type PatientLoginFormValues = z.infer<typeof patientLoginFormSchema>;

const doctorLoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type DoctorLoginFormValues = z.infer<typeof doctorLoginFormSchema>;

interface LoginFormProps {
  onAuthSuccess: (user: AuthenticatedUser) => void;
}

type FormMode = 'patientLogin' | 'doctorLogin' | 'doctorRegister';

export function LoginForm({ onAuthSuccess }: LoginFormProps) {
  const [userType, setUserType] = useState<UserRole>('patient');
  const [formMode, setFormMode] = useState<FormMode>('patientLogin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const patientForm = useForm<PatientLoginFormValues>({
    resolver: zodResolver(patientLoginFormSchema),
    defaultValues: { username: '', email: '' },
  });

  const doctorLoginForm = useForm<DoctorLoginFormValues>({
    resolver: zodResolver(doctorLoginFormSchema),
    defaultValues: { email: '' },
  });

  const handleUserTypeChange = (value: UserRole) => {
    setUserType(value);
    if (value === 'patient') {
      setFormMode('patientLogin');
    } else {
      setFormMode('doctorLogin'); 
    }
  };

  function onPatientLoginSubmit(data: PatientLoginFormValues) {
    setIsSubmitting(true);
    // Patient login is still mock
    onAuthSuccess({
      id: data.username, 
      name: data.username,
      email: data.email.toLowerCase(),
      role: 'patient',
    });
    setIsSubmitting(false);
  }

  async function onDoctorLoginSubmit(data: DoctorLoginFormValues) {
    setIsSubmitting(true);
    try {
      // Use mock getDoctorByEmail
      const doctor = await getDoctorByEmail(data.email.toLowerCase());
      if (doctor) {
        onAuthSuccess({
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          role: 'doctor',
        });
      } else {
        toast({
          title: "Login Failed",
          description: "No doctor found with this email. Please check your email or register.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Doctor login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const renderFormContent = () => {
    if (formMode === 'patientLogin') {
      return (
        <Form {...patientForm}>
          <form onSubmit={patientForm.handleSubmit(onPatientLoginSubmit)}>
            <CardContent className="space-y-6 px-6 py-8">
              <FormField
                control={patientForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Username</FormLabel>
                    <FormControl>
                      <Input className="text-base" placeholder="e.g., johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={patientForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input className="text-base" type="email" placeholder="e.g., user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="px-6 pb-8">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                {isSubmitting ? "Logging in..." : "Login as Patient"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      );
    } else if (formMode === 'doctorLogin') {
      return (
        <Form {...doctorLoginForm}>
          <form onSubmit={doctorLoginForm.handleSubmit(onDoctorLoginSubmit)}>
            <CardContent className="space-y-6 px-6 py-8">
              <FormField
                control={doctorLoginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Doctor Email</FormLabel>
                    <FormControl>
                      <Input className="text-base" type="email" placeholder="e.g., dr.jane@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col px-6 pb-8 space-y-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={isSubmitting}>
                 {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                 {isSubmitting ? "Logging in..." : "Login as Doctor"}
              </Button>
              <Button variant="link" onClick={() => setFormMode('doctorRegister')} className="text-primary" disabled={isSubmitting}>
                New Doctor? Register here
              </Button>
            </CardFooter>
          </form>
        </Form>
      );
    } else if (formMode === 'doctorRegister') {
      return (
        <CardContent className="px-6 py-8">
          <DoctorRegistrationForm onRegisterSuccess={onAuthSuccess} />
           <Button variant="link" onClick={() => setFormMode('doctorLogin')} className="text-primary mt-4 w-full" disabled={isSubmitting}>
             Already registered? Login here
           </Button>
        </CardContent>
      );
    }
  };
  
  const cardTitle = formMode === 'patientLogin' ? "Patient Login" : 
                    formMode === 'doctorLogin' ? "Doctor Login" : "Doctor Registration";
  const cardIcon = formMode === 'patientLogin' ? <User className="h-8 w-8" /> :
                   formMode === 'doctorLogin' ? <LogIn className="h-8 w-8" /> : <UserPlus className="h-8 w-8" />;


  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-250px)] sm:min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <div className="mx-auto flex items-center justify-center bg-primary/10 text-primary rounded-full h-16 w-16 mb-4">
            {cardIcon}
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            {cardTitle}
          </CardTitle>
          <CardDescription className="text-md">Welcome to MediBook. Please select your role and proceed.</CardDescription>
        </CardHeader>
        
        <div className="px-6 py-4">
          <RadioGroup
            defaultValue="patient"
            onValueChange={(value: string) => handleUserTypeChange(value as UserRole)}
            className="flex justify-center space-x-4 mb-6"
            disabled={isSubmitting}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="patient" id="patient-role" disabled={isSubmitting}/>
              <Label htmlFor="patient-role" className="text-base flex items-center"><User className="mr-2 h-5 w-5"/> Patient</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="doctor" id="doctor-role" disabled={isSubmitting}/>
              <Label htmlFor="doctor-role" className="text-base flex items-center"><BriefcaseMedical className="mr-2 h-5 w-5"/> Doctor</Label>
            </div>
          </RadioGroup>
        </div>
        
        {renderFormContent()}
      </Card>
    </div>
  );
}
