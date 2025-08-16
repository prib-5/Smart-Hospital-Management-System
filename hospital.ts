
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { mockDepartments, mockDoctors, mockAppointmentsDB, baseTimeSlots as mockBaseTimeSlots, unknownDepartment as mockUnknownDepartment } from '@/data/mock-data';

// Re-export constants for components
export const baseTimeSlots = mockBaseTimeSlots;
export const unknownDepartment = mockUnknownDepartment;

// Helper to check if Firebase is configured
const isFirebaseConfigured = () => {
    const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };
    return !!config.projectId;
}

// Helper to convert Firestore doc to our object shape
const docToObj = (d) => {
    if (!d.exists()) {
        return undefined;
    }
    const data = d.data();
    // Convert Timestamps to Dates
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate();
        }
    }
    return { ...data, id: d.id };
}

// --- Department Functions ---
export async function getDepartments() {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured. Using mock departments.');
    return [...mockDepartments];
  }
  try {
    const departmentsCol = collection(db, 'departments');
    const q = query(departmentsCol, orderBy('name'));
    const departmentsSnapshot = await getDocs(q);
    
    if (departmentsSnapshot.empty) {
        console.log("No departments found in Firestore. Seeding from mock data...");
        for (const dept of mockDepartments) {
            // Use department 'id' as the document ID in Firestore
            await setDoc(doc(db, 'departments', dept.id), dept);
        }
        return [...mockDepartments];
    }
    
    return departmentsSnapshot.docs.map(docToObj);
  } catch (error) {
    console.error('Error getting departments from Firestore:', error);
    console.log('Falling back to mock departments');
    return [...mockDepartments];
  }
}

export async function getDepartmentById(departmentId) {
    if (!isFirebaseConfigured()) {
        console.log(`Firebase not configured. Using mock department for ID: ${departmentId}`);
        return mockDepartments.find(d => d.id === departmentId);
    }
    try {
        const docRef = doc(db, 'departments', departmentId);
        const docSnap = await getDoc(docRef);
        return docToObj(docSnap);
    } catch (error) {
        console.error('Error getting department by ID from Firestore:', error);
        console.log(`Falling back to mock department for ID: ${departmentId}`);
        return mockDepartments.find(d => d.id === departmentId);
    }
}

// --- Doctor Functions ---
let nextMockDoctorId = mockDoctors.length + 1;

export async function registerDoctor(doctorData) {
    if (!isFirebaseConfigured()) {
        console.log('Firebase not configured. Registering doctor using mock data.');
        const existingDoctor = mockDoctors.find(d => d.email.toLowerCase() === doctorData.email.toLowerCase());
        if (existingDoctor) {
            console.error('Mock: Doctor with this email already exists.');
            return null;
        }
        const newMockDoctor = {
          ...doctorData,
          id: `mock_doc_${nextMockDoctorId++}`,
          email: doctorData.email.toLowerCase(),
        };
        mockDoctors.push(newMockDoctor);
        return newMockDoctor;
    }

    try {
        const q = query(collection(db, 'doctors'), where('email', '==', doctorData.email.toLowerCase()));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            console.error('DB: Doctor with this email already exists.');
            return null;
        }
        const docRef = await addDoc(collection(db, 'doctors'), {
            ...doctorData,
            email: doctorData.email.toLowerCase(),
        });
        
        const newDocSnap = await getDoc(docRef);
        return docToObj(newDocSnap);
    } catch (error) {
        console.error('Error registering doctor in Firestore:', error);
        return null;
    }
}

export async function getDoctorByEmail(email) {
    if (!isFirebaseConfigured()) {
        console.log(`Firebase not configured. Using mock doctor for email: ${email}`);
        return mockDoctors.find(d => d.email.toLowerCase() === email.toLowerCase());
    }
    try {
        const q = query(collection(db, 'doctors'), where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return undefined;
        return docToObj(querySnapshot.docs[0]);
    } catch (error) {
        console.error('Error getting doctor by email from Firestore:', error);
        console.log(`Falling back to mock doctor for email: ${email}`);
        return mockDoctors.find(d => d.email.toLowerCase() === email.toLowerCase());
    }
}

export async function getDoctorsByDepartment(departmentId) {
    if (!isFirebaseConfigured()) {
        console.log(`Firebase not configured. Using mock doctors for department ID: ${departmentId}`);
        return mockDoctors.filter(d => d.departmentId === departmentId);
    }
    try {
        // Ensure doctors collection is seeded before querying.
        const doctorsCollectionRef = collection(db, 'doctors');
        const doctorsSnapshotCheck = await getDocs(query(doctorsCollectionRef));
        if (doctorsSnapshotCheck.empty) {
            console.log("Doctors collection is empty. Seeding now...");
            for (const docData of mockDoctors) {
                await setDoc(doc(db, 'doctors', docData.id), docData);
            }
        }
        
        const q = query(doctorsCollectionRef, where('departmentId', '==', departmentId), orderBy('name'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(docToObj);
    } catch (error) {
        console.error('Error getting doctors by department from Firestore:', error);
        console.log(`Falling back to mock doctors for department ID: ${departmentId}`);
        return mockDoctors.filter(d => d.departmentId === departmentId);
    }
}

export async function getAllDoctors() {
    if (!isFirebaseConfigured()) {
        console.log('Firebase not configured. Using all mock doctors.');
        return [...mockDoctors];
    }
    try {
        const doctorsCollectionRef = collection(db, 'doctors');
        const q = query(doctorsCollectionRef, orderBy('name'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            console.log("No doctors found in Firestore. Seeding from mock data...");
            for (const docData of mockDoctors) {
                await setDoc(doc(db, 'doctors', docData.id), docData);
            }
            return [...mockDoctors];
        }
        
        return querySnapshot.docs.map(docToObj);
    } catch (error) {
        console.error('Error getting all doctors from Firestore:', error);
        console.log('Falling back to all mock doctors');
        return [...mockDoctors];
    }
}

// --- Appointment and Time Slot Functions ---
let nextMockAppointmentId = mockAppointmentsDB.length + 1;

export async function getAvailableTimeSlots(doctorId, date) {  
    console.log(`Fetching available slots for Dr. ${doctorId} on ${date.toDateString()}`);
    if (!isFirebaseConfigured()) {
        const bookedSlotsForDoctorOnDate = mockAppointmentsDB
            .filter(appt => appt.doctorId === doctorId && new Date(appt.date).toDateString() === date.toDateString())
            .map(appt => appt.timeSlot.id);
        return baseTimeSlots.filter(slot => !bookedSlotsForDoctorOnDate.includes(slot.id));
    }

    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const q = query(
            collection(db, "appointments"),
            where("doctorId", "==", doctorId),
            where("date", ">=", Timestamp.fromDate(startOfDay)),
            where("date", "<=", Timestamp.fromDate(endOfDay))
        );
        const querySnapshot = await getDocs(q);
        const bookedAppointments = querySnapshot.docs.map(docToObj);
        const bookedSlotIds = bookedAppointments.map(appt => appt.timeSlot.id);
        return baseTimeSlots.filter(slot => !bookedSlotIds.includes(slot.id));

    } catch (error) {
        console.error('Error fetching available slots from Firestore:', error);
        return [...baseTimeSlots]; // Fallback to all slots on error
    }
}

export async function bookTimeSlot(
    department,
    doctor,
    date,
    timeSlot,
    patientName,
    patientEmail,
    patientPhone
) {
    if (!isFirebaseConfigured()) {
        console.log('Firebase not configured. Booking appointment using mock data.');
        const newMockAppointment = {
            id: `mock_appt_${nextMockAppointmentId++}`,
            departmentId: department.id,
            departmentName: department.name,
            doctorId: doctor.id,
            doctorName: doctor.name,
            date,
            timeSlot,
            patientName,
            patientEmail: patientEmail.toLowerCase(),
            patientPhone,
        };
        const alreadyBooked = mockAppointmentsDB.find(appt => 
            appt.doctorId === doctor.id && 
            new Date(appt.date).toDateString() === new Date(date).toDateString() &&
            appt.timeSlot.id === timeSlot.id
        );
        if (alreadyBooked) {
            console.warn("Mock: This time slot is already booked.");
            return false;
        }
        mockAppointmentsDB.push(newMockAppointment);
        return true;
    }

    try {
        const newAppointmentData = {
            departmentId: department.id,
            departmentName: department.name,
            doctorId: doctor.id,
            doctorName: doctor.name,
            date: Timestamp.fromDate(date),
            timeSlot,
            patientName,
            patientEmail: patientEmail.toLowerCase(),
            patientPhone,
        };
        
        // Check for conflicts before writing
        const availableSlots = await getAvailableTimeSlots(doctor.id, date);
        const isSlotAvailable = availableSlots.some(slot => slot.id === timeSlot.id);
        
        if (!isSlotAvailable) {
            console.warn("DB: This time slot is already booked.");
            return false;
        }

        await addDoc(collection(db, 'appointments'), newAppointmentData);
        return true;
    } catch (error) {
        console.error('Error booking appointment in Firestore:', error);
        return false;
    }
}

export async function getAppointmentsForPatient(patientEmail) {
    if (!isFirebaseConfigured()) {
        console.log(`Firebase not configured. Using mock appointments for patient email: ${patientEmail}`);
        return mockAppointmentsDB.filter(appt => appt.patientEmail.toLowerCase() === patientEmail.toLowerCase());
    }
    try {
        const q = query(
            collection(db, "appointments"),
            where("patientEmail", "==", patientEmail.toLowerCase()),
            orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(docToObj);
    } catch (error) {
        console.error('Error getting appointments for patient from Firestore:', error);
        console.log(`Falling back to mock appointments for patient email: ${patientEmail}`);
        return mockAppointmentsDB.filter(appt => appt.patientEmail.toLowerCase() === patientEmail.toLowerCase());
    }
}

export async function getAppointmentsForDoctor(doctorId) {
    if (!isFirebaseConfigured()) {
        console.log(`Firebase not configured. Using mock appointments for doctor ID: ${doctorId}`);
        return mockAppointmentsDB.filter(appt => appt.doctorId === doctorId);
    }
    try {
        const q = query(
            collection(db, "appointments"),
            where("doctorId", "==", doctorId),
            orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(docToObj);
    } catch (error) {
        console.error('Error getting appointments for doctor from Firestore:', error);
        console.log(`Falling back to mock appointments for doctor ID: ${doctorId}`);
        return mockAppointmentsDB.filter(appt => appt.doctorId === doctorId);
    }
}
