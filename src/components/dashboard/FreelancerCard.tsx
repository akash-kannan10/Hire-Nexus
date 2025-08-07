import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Clock, DollarSign, CheckCircle } from "lucide-react";
import HireModal from "./HireModal";

interface FreelancerCardProps {
  freelancer: {
    id: string;
    fullName: string;
    title: string;
    description: string;
    experience: string;
    hourlyRate: string;
    rating: number;
    reviewCount: number;
    responseTime: string;
    availability: string;
    location: string;
    selectedServices: string[];
    skills: string[];
    verifications: string[];
  };
}

const FreelancerCard = ({ freelancer }: FreelancerCardProps) => {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  return (
    <>
      <Card className="animate-fade-in hover-lift h-full border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {freelancer.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {freelancer.fullName}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {freelancer.title}
              </p>
              <div className="flex items-center mt-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-sm font-medium ml-1">{freelancer.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground ml-1">({freelancer.reviewCount})</span>
              </div>
            </div>
            
            <Badge variant={freelancer.availability === 'Available' ? 'default' : 'secondary'}>
              {freelancer.availability}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {freelancer.description}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {freelancer.selectedServices.slice(0, 2).map((service, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
            {freelancer.selectedServices.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{freelancer.selectedServices.length - 2}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{freelancer.hourlyRate}/hr</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{freelancer.responseTime}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{freelancer.location}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{freelancer.experience} exp</span>
            </div>
          </div>

          <div className="flex items-center text-xs text-muted-foreground pt-2 border-t border-border">
            {freelancer.verifications.includes('Professional') && (
              <Badge variant="outline" className="text-xs mr-2">
                Verified Pro
              </Badge>
            )}
            <span>{freelancer.verifications.length} verification{freelancer.verifications.length !== 1 ? 's' : ''}</span>
          </div>
          
          <Button 
            onClick={() => setIsHireModalOpen(true)}
            className="w-full mt-4 hover-scale"
            size="sm"
            disabled={freelancer.availability !== 'Available'}
          >
            Hire Now
          </Button>
        </CardContent>
      </Card>

      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        freelancer={freelancer}
      />
    </>
  );
};

export default FreelancerCard;