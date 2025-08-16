
'use client';

import type { Doctor, Department, TimeSlot } from '@/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
// Changed import from firebase-data-service to hospital service
import { getAvailableTimeSlots } from '@/services/hospital';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentSchedulerProps {
  department: Department;
  doctor: Doctor;
  onSelectSlot: (date: Date, slot: TimeSlot) => void;
  onBack: () => void;
}

export function AppointmentScheduler({ department, doctor, onSelectSlot, onBack }: AppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setCurrentMonth(new Date());
  }, []);


  useEffect(() => {
    if (selectedDate) {
      const fetchSlots = async () => {
        setIsLoadingSlots(true);
        try {
          // Use mock getAvailableTimeSlots
          const slots = await getAvailableTimeSlots(doctor.id, selectedDate);
          setAvailableSlots(slots);
        } catch (error) {
          console.error("Failed to fetch time slots:", error);
          setAvailableSlots([]);
          // Optionally, set an error state and display a message
        }
        setIsLoadingSlots(false);
      };
      fetchSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, doctor.id]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-primary">Schedule with {doctor.name}</CardTitle>
            <Button variant="outline" size="sm" onClick={onBack} aria-label="Go back to doctor selection">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        </div>
        <CardDescription>Select a date and an available time slot for your appointment in the {department.name} department.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-primary">Select Date</h3>
          {currentMonth && (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < today}
              initialFocus
              month={currentMonth} 
              className="rounded-md border bg-card p-3"
            />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-primary">
            Available Slots {selectedDate ? `for ${format(selectedDate, 'PPP')}` : ''}
          </h3>
          {isLoadingSlots ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedDate ? (
            availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant="outline"
                    className="flex flex-col h-auto items-center justify-center p-3 hover:bg-secondary hover:text-secondary-foreground transition-colors"
                    onClick={() => onSelectSlot(selectedDate, slot)}
                  >
                    <Clock className="h-5 w-5 mb-1" />
                    <span className="text-sm">{slot.startTime}</span>
                    <span className="text-xs text-muted-foreground">{slot.endTime}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No slots available for this date. Please select another date.</p>
            )
          ) : (
            <p className="text-muted-foreground">Please select a date to see available time slots.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
