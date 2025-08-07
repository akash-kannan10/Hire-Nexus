import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground",
                isCurrent && "scale-110 ring-2 ring-primary/30"
              )}
            >
              {stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-2 transition-colors duration-200",
                  stepNumber < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}