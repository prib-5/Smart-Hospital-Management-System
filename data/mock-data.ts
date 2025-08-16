import type { Department, Doctor, TimeSlot, Appointment } from '@/types';

// --- Mock Data ---
export const mockDepartments: Department[] = [
  { id: 'dept1', name: 'Cardiology', iconName: 'Heart', description: 'Specializes in heart-related issues.' },
  { id: 'dept2', name: 'Neurology', iconName: 'Brain', description: 'Deals with nervous system disorders.' },
  { id: 'dept3', name: 'Orthopedics', iconName: 'Activity', description: 'Focuses on bone and joint problems.' },
  { id: 'dept4', name: 'Pediatrics', iconName: 'Baby', description: 'Provides care for infants and children.' },
  { id: 'dept5', name: 'General Medicine', iconName: 'Stethoscope', description: 'General health checkups and treatments.' },
];

export const mockDoctors: Doctor[] = [
  { id: 'doc1', name: 'Dr. Alice Smith', email: 'alice.smith@example.com', departmentId: 'dept1', specialty: 'Cardiologist' },
  { id: 'doc2', name: 'Dr. Bob Johnson', email: 'bob.johnson@example.com', departmentId: 'dept1', specialty: 'Interventional Cardiologist' },
  { id: 'doc3', name: 'Dr. Carol White', email: 'carol.white@example.com', departmentId: 'dept2', specialty: 'Neurologist' },
  { id: 'doc4', name: 'Dr. David Brown', email: 'david.brown@example.com', departmentId: 'dept3', specialty: 'Orthopedic Surgeon' },
  { id: 'doc5', name: 'Dr. Eve Davis', email: 'eve.davis@example.com', departmentId: 'dept4', specialty: 'Pediatrician' },
  { id: 'doc6', name: 'Dr. Frank Green', email: 'frank.green@example.com', departmentId: 'dept5', specialty: 'General Practitioner' },
  { id: 'doc7', name: 'Dr. Grace Lee', email: 'grace.lee@example.com', departmentId: 'dept2', specialty: 'Neurosurgeon' },
  { id: 'doctor.test@example.com', name: 'Dr. Test Doctor', email: 'doctor.test@example.com', departmentId: 'dept1', specialty: 'Cardiologist' } // For testing doctor login
];

export const baseTimeSlots: TimeSlot[] = [
  { id: 'ts1', startTime: '09:00', endTime: '09:30' },
  { id: 'ts2', startTime: '09:30', endTime: '10:00' },
  { id: 'ts3', startTime: '10:00', endTime: '10:30' },
  { id: 'ts4', startTime: '10:30', endTime: '11:00' },
  { id: 'ts5', startTime: '11:00', endTime: '11:30' },
  { id: 'ts6', startTime: '11:30', endTime: '12:00' },
  { id: 'ts7', startTime: '14:00', endTime: '14:30' },
  { id: 'ts8', startTime: '14:30', endTime: '15:00' },
  { id: 'ts9', startTime: '15:00', endTime: '15:30' },
  { id: 'ts10', startTime: '15:30', endTime: '16:00' },
];

// Mutable array for mock appointments
export let mockAppointmentsDB: Appointment[] = [
    {
        id: 'appt1',
        departmentId: 'dept1',
        departmentName: 'Cardiology',
        doctorId: 'doc1',
        doctorName: 'Dr. Alice Smith',
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        timeSlot: { id: 'ts1', startTime: '09:00', endTime: '09:30' },
        patientName: 'John Patient',
        patientEmail: 'john.patient@example.com',
        patientPhone: '123-456-7890',
    },
    {
        id: 'appt2',
        departmentId: 'dept2',
        departmentName: 'Neurology',
        doctorId: 'doc3',
        doctorName: 'Dr. Carol White',
        date: new Date(new Date().setDate(new Date().getDate() + 5)),
        timeSlot: { id: 'ts3', startTime: '10:00', endTime: '10:30' },
        patientName: 'Jane Patient',
        patientEmail: 'jane.patient@example.com',
        patientPhone: '987-654-3210',
    },
    { // For testing doctor login with doctor.test@example.com (ID: doctor.test@example.com)
        id: 'appt_doctor_test_1',
        departmentId: 'dept1',
        departmentName: 'Cardiology',
        doctorId: 'doctor.test@example.com',
        doctorName: 'Dr. Test Doctor',
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        timeSlot: { id: 'ts2', startTime: '09:30', endTime: '10:00' },
        patientName: 'Test Patient A',
        patientEmail: 'test.patient.a@example.com',
        patientPhone: '111-222-3333',
    }
];

export const unknownDepartment: Department = {
  id: 'unknown',
  name: 'Unknown Department',
  iconName: 'HelpCircle',
  description: 'Department information not available.',
};
