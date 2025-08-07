import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Users,
  Shield,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-image.jpg";

interface HomeProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Home = ({ onLoginClick, onSignUpClick }: HomeProps) => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    query: "",
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !contactForm.name.trim() ||
      !contactForm.email.trim() ||
      !contactForm.query.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    // Save to localStorage for demo purposes
    const queries = JSON.parse(
      localStorage.getItem("hire-nexus-queries") || "[]"
    );
    queries.push({
      ...contactForm,
      submittedAt: new Date().toISOString(),
      id: Date.now().toString(),
    });
    localStorage.setItem("hire-nexus-queries", JSON.stringify(queries));

    toast.success("Thank you for your query! We'll get back to you soon.");
    setContactForm({ name: "", email: "", query: "" });
  };

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Connect Globally",
      description:
        "Access a worldwide network of talented freelancers and meaningful projects",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Transactions",
      description:
        "Bank-level security with encrypted payments and dispute protection",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Matching",
      description:
        "AI-powered algorithms match you with perfect opportunities in seconds",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Zero Application Fees",
      description:
        "Apply to unlimited projects without hidden costs or credit requirements",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight">
                  Welcome to <span className="text-primary">Hire-Nexus</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The revolutionary platform that connects talented freelancers
                  with meaningful projects. No barriers, no fees, just pure
                  opportunity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={onSignUpClick}
                  className="text-lg px-8 py-6 shadow-elegant hover:shadow-soft transition-smooth"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onLoginClick}
                  className="text-lg px-8 py-6 border-border/50 hover:border-primary/50 transition-smooth"
                >
                  Sign In
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 rating</span>
                </div>
                <div>10,000+ active users</div>
                <div>$2M+ earned by freelancers</div>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Professional freelancers collaborating"
                className="rounded-2xl shadow-elegant w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Hire-Nexus?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're revolutionizing the freelance marketplace by eliminating the
              barriers that hold talent back. No more paying to apply, no more
              hidden fees, just pure opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center border-border/50 shadow-soft hover:shadow-elegant transition-smooth"
              >
                <CardHeader className="pb-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-subtle rounded-2xl p-8 lg:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                Our Mission
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We believe talent should be the only currency in the freelance
                world. That's why we've eliminated the predatory credit systems
                and application fees that plague other platforms. At Hire-Nexus,
                your skills speak louder than your wallet.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Free to Apply
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">0</div>
                  <div className="text-sm text-muted-foreground">
                    Hidden Fees
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Have Questions?
            </h2>
            <p className="text-xl text-muted-foreground">
              We're here to help you succeed. Send us your query and we'll get
              back to you quickly.
            </p>
          </div>

          <Card className="shadow-elegant border-border/50">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your full name"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter your email address"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="query">Your Query</Label>
                  <Textarea
                    id="query"
                    value={contactForm.query}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        query: e.target.value,
                      }))
                    }
                    placeholder="Tell us how we can help you..."
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto px-5">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
