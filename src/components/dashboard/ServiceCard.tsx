import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Clock, DollarSign, User } from "lucide-react";
import { format } from "date-fns";
import ApplicationModal from "./ApplicationModal";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    postedOn: string;
    location: string;
    field: string;
    budget: string;
    duration: string;
    postedBy: string;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  return (
    <>
      <Card className="animate-fade-in hover-lift h-full border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold line-clamp-2 pr-4">
              {service.title}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {service.field}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {service.description}
          </p>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">
                {format(new Date(service.postedOn), "MMM dd, yyyy")}
              </span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{service.location}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{service.budget}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{service.duration}</span>
            </div>
          </div>

          <div className="flex items-center text-xs text-muted-foreground pt-2 border-t border-border">
            <User className="h-3 w-3 mr-1" />
            Posted by {service.postedBy}
          </div>
          
          <Button 
            onClick={() => setIsApplicationModalOpen(true)}
            className="w-full mt-4"
            size="sm"
          >
            Apply Now
          </Button>
        </CardContent>
      </Card>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        service={service}
      />
    </>
  );
};

export default ServiceCard;