
import type { LucideIcon } from 'lucide-react';

export interface Department {
  id: string;
  name: string;
  iconName: string; 
  description: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string; 
  departmentId: string;
  specialty: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "09:30"
}

// Represents available slots for a doctor on a specific date
export interface DoctorAvailability {
  doctorId: string;
  date: string; // YYYY-MM-DD
  availableSlots: TimeSlot[];
}

export interface Appointment {
  id: string; 
  departmentId: string;
  departmentName: string; 
  doctorId: string;
  doctorName: string; 
  date: Date; // Explicitly Date type for mock data consistency
  timeSlot: TimeSlot;
  patientName: string;
  patientEmail: string; 
  patientPhone: string;
}

export interface BookingData {
  department?: Department; 
  doctor?: Doctor;
  date?: Date;
  timeSlot?: TimeSlot;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
}

export enum BookingStep {
  CHOOSE_SEARCH_METHOD, 
  SELECT_DEPARTMENT,
  SELECT_DOCTOR,
  SELECT_DATE_TIME,
  PATIENT_INFO,
  CONFIRMATION,
  COMPLETED
}

export type UserRole = 'patient' | 'doctor';

export interface AuthenticatedUser {
  id: string; // patient username or doctor ID
  name: string;
  email: string;
  role: UserRole;
}
