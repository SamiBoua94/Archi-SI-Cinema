import { Programmation } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface MovieScheduleProps {
  programmation: Programmation;
}

export default function MovieSchedule({ programmation }: MovieScheduleProps) {
  // Format days for display
  const days = [programmation.jour_1, programmation.jour_2, programmation.jour_3];
  
  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {days.map((day, index) => (
          <Badge key={index} variant="outline" className="capitalize">
            {day}
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center text-sm">
        <Clock className="h-3 w-3 mr-1" />
        <span className="font-medium">{programmation.heure_debut}</span>
      </div>
    </div>
  );
}
