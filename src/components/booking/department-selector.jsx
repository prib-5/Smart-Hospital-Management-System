
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Changed import from firebase-data-service to hospital service
import { getDepartments } from '@/services/hospital'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Loader2, Stethoscope, Heart, Brain, Activity, Baby, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';


const iconMap = {
  Stethoscope, Heart, Brain, Activity, Baby, HelpCircle
};

export function DepartmentSelector({ onSelectDepartment, onBack }) {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        // Use mock getDepartments
        const fetchedDepartments = await getDepartments();
        setDepartments(fetchedDepartments);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        // Optionally, set an error state and display a message
      }
      setIsLoading(false);
    };
    fetchDepartments();
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Loading Departments...</CardTitle>
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
          <CardTitle className="text-2xl text-primary">Select a Department</CardTitle>
          <Button variant="outline" size="sm" onClick={onBack} aria-label="Go back to search method selection">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <CardDescription>Choose the department you wish to book an appointment with.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => {
              const IconComponent = iconMap[dept.iconName] || HelpCircle;
              return (
                <Card 
                  key={dept.id} 
                  onClick={() => onSelectDepartment(dept)}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-primary"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectDepartment(dept)}
                  aria-label={`Select ${dept.name} department`}
                >
                  <CardHeader className="flex flex-row items-center space-x-4 p-4">
                    <IconComponent className="h-10 w-10 text-secondary" />
                    <div>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">{dept.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
