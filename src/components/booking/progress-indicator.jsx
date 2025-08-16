
'use client';

import { BookingStep } from '@/types';
import { cn } from '@/lib/utils';
import { Search, ListChecks, UserPlus, CalendarClock, UserCog, Send, CheckSquare } from 'lucide-react';


const allStepDetails = [
  { name: 'Search', icon: Search, step: BookingStep.CHOOSE_SEARCH_METHOD },
  { name: 'Department', icon: ListChecks, step: BookingStep.SELECT_DEPARTMENT },
  { name: 'Doctor', icon: UserPlus, step: BookingStep.SELECT_DOCTOR },
  { name: 'Date & Time', icon: CalendarClock, step: BookingStep.SELECT_DATE_TIME },
  { name: 'Your Info', icon: UserCog, step: BookingStep.PATIENT_INFO },
  { name: 'Confirm', icon: Send, step: BookingStep.CONFIRMATION },
  { name: 'Completed', icon: CheckSquare, step: BookingStep.COMPLETED },
];

export function ProgressIndicator({ currentStep }) {
  // Determine which steps to show. We filter out "Department" if we are in "Completed" step or if we skipped it (nearMe flow implies doctor first).
  // However, for simplicity in display, we will always show SELECT_DEPARTMENT, but it will be marked completed if skipped.
  // The critical part is to handle the "COMPLETED" state correctly for display.
  const visibleSteps = allStepDetails.filter(sd => {
    if (currentStep === BookingStep.COMPLETED) {
      return sd.step === BookingStep.COMPLETED;
    }
    return sd.step !== BookingStep.COMPLETED;
  });

  return (
    <div className="mb-8 p-4 bg-card rounded-lg shadow">
      <ol className="flex items-center w-full">
        {visibleSteps.map((stepDetail, index) => {
          const isActive = currentStep === stepDetail.step;
          const isIconCompleted = currentStep > stepDetail.step;
          const isIconFuture = currentStep < stepDetail.step;
          
          // Special handling for department step if it was skipped in "near me" flow.
          // If current step is past SELECT_DOCTOR and department was not part of the flow (e.g. BookingStep.CHOOSE_SEARCH_METHOD -> BookingStep.SELECT_DOCTOR),
          // then SELECT_DEPARTMENT should also be marked as completed.
          // This condition becomes tricky with the new CHOOSE_SEARCH_METHOD step.
          // A simpler logic: a step is completed if `currentStep` is greater than it.
          // A step is active if `currentStep` equals it.
          // A step is future if `currentStep` is less than it.

          return (
            <li
              key={stepDetail.name}
              className={cn(
                "flex w-full items-center",
                index < visibleSteps.length - 1 &&
                  "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block",
                isIconCompleted ? "after:border-primary" : "after:border-muted",
                stepDetail.step === BookingStep.COMPLETED ? "flex-1 justify-center" : ""
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors duration-300",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/30",
                  isIconCompleted && "bg-primary text-primary-foreground",
                  isIconFuture && "bg-muted text-muted-foreground"
                )}
                title={stepDetail.name}
              >
                <stepDetail.icon className="w-5 h-5" />
              </span>
              <div className={cn(
                "ml-2 text-sm font-medium",
                isActive && "text-primary",
                isIconCompleted && "text-primary",
                isIconFuture && "text-muted-foreground",
                "hidden sm:block" 
              )}>
                {stepDetail.name}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
