
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Changed import from firebase-data-service to hospital service
import { getDoctorsByDepartment, getAllDoctors } from '@/services/hospital';
import { UserCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';


export function DoctorSelector({ department, onSelectDoctor, onBack }) {
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        // Use mock getDoctorsByDepartment and getAllDoctors
        const doctors = department 
          ? await getDoctorsByDepartment(department.id) 
          : await getAllDoctors();
        setAvailableDoctors(doctors);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        // Optionally, set an error state and display a message
      }
      setIsLoading(false);
    };
    fetchDoctors();
  }, [department]);

  const title = department 
    ? `Select a Doctor in ${department.name}` 
    : 'Select an Available Doctor'; 

  const description = department 
    ? `Choose a doctor for your appointment in the ${department.name} department.`
    : 'Choose from all available doctors. For a real app, this list would be filtered by your location.';

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Loading Doctors...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-primary">{title}</CardTitle>
          <Button variant="outline" size="sm" onClick={onBack} aria-label="Go back">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {availableDoctors.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDoctors.map((doc) => (
                <Card 
                  key={doc.id} 
                  onClick={() => onSelectDoctor(doc)}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-primary"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectDoctor(doc)}
                  aria-label={`Select Dr. ${doc.name}, ${doc.specialty}`}
                >
                  <CardHeader className="flex flex-row items-center space-x-4 p-4">
                    <UserCircle className="h-10 w-10 text-secondary" /> 
                    <div>
                      <CardTitle className="text-lg">{doc.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground">No doctors available {department ? `in this department` : `at this time`}.</p>
        )}
      </CardContent>
    </Card>
  );
}
