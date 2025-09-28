import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { PortfolioInfoForm } from '@/components/Admin/PortfolioInfoForm';
import { ProjectsManager } from '@/components/Admin/ProjectsManager';
import { SkillsManager } from '@/components/Admin/SkillsManager';
import { ContactInfoForm } from '@/components/Admin/ContactInfoForm';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const handleDataSaved = () => {
    // Dispatch custom event to trigger portfolio data refresh
    window.dispatchEvent(new CustomEvent('portfolioUpdated'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Portfolio Admin</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Welcome back, Admin</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Button variant="outline" onClick={() => navigate('/')} className="w-full sm:w-auto text-sm">
              View Portfolio
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto text-sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <Tabs defaultValue="portfolio" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="portfolio" className="text-xs sm:text-sm">Portfolio Info</TabsTrigger>
            <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
            <TabsTrigger value="skills" className="text-xs sm:text-sm">Skills</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <PortfolioInfoForm userId={user?.id} onDataSaved={handleDataSaved} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsManager userId={user?.id} />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsManager userId={user?.id} />
          </TabsContent>

          <TabsContent value="contact">
            <ContactInfoForm userId={user?.id} onDataSaved={handleDataSaved} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}