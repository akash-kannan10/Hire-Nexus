import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import ServiceCard from "@/components/dashboard/ServiceCard";
import FreelancerCard from "@/components/dashboard/FreelancerCard";
import PostWorkModal from "@/components/dashboard/PostWorkModal";
import { initialProjects, projectsData } from "@/data/projectsData";
import { initialFreelancers, allFreelancers } from "@/data/freelancersData";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'projects' | 'freelancers'>('projects');
  const [showPostWorkModal, setShowPostWorkModal] = useState(false);

  useEffect(() => {
    // Load current user to determine dashboard type
    const user = JSON.parse(localStorage.getItem("hire-nexus-current-user") || "{}");
    setCurrentUser(user);
    
    if (user.userType === 'seeker') {
      setViewMode('freelancers');
      setDisplayedItems(initialFreelancers);
      setAllItems(allFreelancers);
    } else {
      setViewMode('projects');
      setDisplayedItems(initialProjects);
      setAllItems(projectsData);
    }
  }, []);

  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(displayedItems);
    } else {
      let filtered;
      if (viewMode === 'projects') {
        // Search in all projects when searching
        filtered = allItems.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      } else {
        // Search in all freelancers when searching
        filtered = allItems.filter(item =>
          item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.selectedServices.some((service: string) => service.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setFilteredItems(filtered);
    }
  }, [searchQuery, displayedItems, allItems, viewMode]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {viewMode === 'projects' ? 'Available Projects' : 'Available Freelancers'}
              </h1>
              <p className="text-muted-foreground">
                {viewMode === 'projects' 
                  ? 'Discover amazing opportunities and connect with clients'
                  : 'Find talented freelancers for your next project'
                }
              </p>
            </div>
            
            {/* Post New Work Button for Service Seekers */}
            {currentUser?.userType === 'seeker' && viewMode === 'freelancers' && (
              <div className="flex-shrink-0">
                <Button 
                  onClick={() => setShowPostWorkModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 hover-scale"
                  size="lg"
                >
                  ✨ Post New Work
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={viewMode === 'projects' 
                ? "Search projects, skills, or locations..." 
                : "Search freelancers, skills, or locations..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-border/50 focus:border-primary shadow-soft"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredItems.length} {viewMode === 'projects' ? 'project' : 'freelancer'}{filteredItems.length !== 1 ? 's' : ''} found
            {searchQuery && (
              <span className="ml-1">
                for "<span className="text-foreground font-medium">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {viewMode === 'projects' ? (
                  <ServiceCard service={item} />
                ) : (
                  <FreelancerCard freelancer={item} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No {viewMode === 'projects' ? 'projects' : 'freelancers'} found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse all available {viewMode === 'projects' ? 'projects' : 'freelancers'}.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4 hover-scale"
              >
                Clear Search
              </Button>
            </div>
          </div>
        )}
        
        {/* Post Work Modal */}
        <PostWorkModal 
          isOpen={showPostWorkModal} 
          onClose={() => setShowPostWorkModal(false)} 
        />
      </div>
    </div>
  );
};

export default Dashboard;