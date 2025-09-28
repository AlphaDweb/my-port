import { Navigation } from "@/components/Portfolio/Navigation";
import { Hero } from "@/components/Portfolio/Hero";
import { About } from "@/components/Portfolio/About";
import { Projects } from "@/components/Portfolio/Projects";
import { Skills } from "@/components/Portfolio/Skills";
import { Contact } from "@/components/Portfolio/Contact";
import { Footer } from "@/components/Portfolio/Footer";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const { portfolioInfo, projects, skills, contactInfo, loading, refetch } = usePortfolioData();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePortfolioUpdate = () => {
      refetch();
    };

    // Listen for portfolio updates
    window.addEventListener('portfolioUpdated', handlePortfolioUpdate);

    return () => {
      window.removeEventListener('portfolioUpdated', handlePortfolioUpdate);
    };
  }, [refetch]);

  // Update document title when portfolio info changes
  useEffect(() => {
    if (portfolioInfo?.website_name) {
      document.title = `${portfolioInfo.website_name} - Portfolio`;
    }
  }, [portfolioInfo?.website_name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin Access Button - Hidden in corner */}
      <div className="fixed bottom-4 right-4 z-[60] pointer-events-auto opacity-30 hover:opacity-100 transition-opacity duration-300">
        <Button onClick={() => navigate('/auth')} variant="ghost" size="sm" className="bg-background/50 backdrop-blur-sm hover:bg-background/80 text-muted-foreground hover:text-foreground">
          <User className="h-4 w-4" />
        </Button>
      </div>
      
      <Navigation websiteName={portfolioInfo?.website_name} />
      <main>
        <Hero data={portfolioInfo} />
        <About data={portfolioInfo} />
        <Projects data={projects} />
        <Skills data={skills} />
        <Contact data={contactInfo} />
      </main>
      <Footer portfolio={portfolioInfo} contact={contactInfo} />
    </div>
  );
};

export default Index;
