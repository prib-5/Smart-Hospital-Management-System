
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Changed import from firebase-data-service to hospital service
import { registerDoctor, getDepartments } from '@/services/hospital';
import type { Doctor, AuthenticatedUser, Department } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const doctorRegistrationSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  specialty: z.string().min(3, { message: "Specialty must be at least 3 characters." }),
  departmentId: z.string({ required_error: "Please select a department." }),
});

type DoctorRegistrationFormValues = z.infer<typeof doctorRegistrationSchema>;

interface DoctorRegistrationFormProps {
  onRegisterSuccess: (user: AuthenticatedUser) => void;
}

export function DoctorRegistrationForm({ onRegisterSuccess }: DoctorRegistrationFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DoctorRegistrationFormValues>({
    resolver: zodResolver(doctorRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      specialty: '',
      departmentId: undefined,
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoadingDepartments(true);
      try {
        // Use mock getDepartments
        const fetchedDepartments = await getDepartments();
        setDepartments(fetchedDepartments);
      } catch (error) {
        console.error("Failed to fetch departments for registration form:", error);
        toast({
          title: "Error",
          description: "Could not load departments. Please try again later.",
          variant: "destructive",
        });
      }
      setIsLoadingDepartments(false);
    };
    fetchDepartments();
  }, [toast]);

  async function onSubmit(data: DoctorRegistrationFormValues) {
    setIsSubmitting(true);
    const newDoctorData: Omit<Doctor, 'id'> = {
      name: data.name,
      email: data.email.toLowerCase(),
      specialty: data.specialty,
      departmentId: data.departmentId,
    };
    
    try {
      // Use mock registerDoctor
      const registeredDoctor = await registerDoctor(newDoctorData);

      if (registeredDoctor) {
        toast({
          title: "Registration Successful",
          description: `Welcome, Dr. ${registeredDoctor.name}!`,
          variant: "default",
          className: "bg-green-500 text-white"
        });
        onRegisterSuccess({
          id: registeredDoctor.id,
          name: registeredDoctor.name,
          email: registeredDoctor.email,
          role: 'doctor',
        });
      } else {
        toast({
          title: "Registration Failed",
          description: "A doctor with this email may already exist or another error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Doctor registration error:", error);
       toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Full Name</FormLabel>
              <FormControl>
                <Input className="text-base" placeholder="e.g., Dr. Jane Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Email</FormLabel>
              <FormControl>
                <Input className="text-base" type="email" placeholder="e.g., dr.jane@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Specialty</FormLabel>
              <FormControl>
                <Input className="text-base" placeholder="e.g., Cardiologist" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingDepartments}>
                <FormControl>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder={isLoadingDepartments ? "Loading departments..." : "Select a department"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingDepartments ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={isLoadingDepartments || isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-5 w-5" />
          )}
          {isSubmitting ? "Registering..." : "Register as Doctor"}
        </Button>
      </form>
    </Form>
  );
}
