
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, MapPin } from 'lucide-react';

interface SearchMethodSelectorProps {
  onSelectMethod: (method: 'department' | 'nearMe') => void;
}

export function SearchMethodSelector({ onSelectMethod }: SearchMethodSelectorProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">How would you like to find a doctor?</CardTitle>
        <CardDescription>Choose your preferred method to start booking an appointment.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <Button
          onClick={() => onSelectMethod('department')}
          className="h-auto py-6 text-lg hover:bg-primary/80 transition-all duration-300 ease-in-out transform hover:scale-105"
          variant="default"
        >
          <Building className="mr-3 h-7 w-7" />
          Book by Department
        </Button>
        <Button
          onClick={() => onSelectMethod('nearMe')}
          className="h-auto py-6 text-lg hover:bg-secondary/80 transition-all duration-300 ease-in-out transform hover:scale-105"
          variant="secondary"
        >
          <MapPin className="mr-3 h-7 w-7" />
          Search Doctors Near Me
        </Button>
      </CardContent>
    </Card>
  );
}
