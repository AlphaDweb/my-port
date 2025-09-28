import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePortfolioData() {
  const [portfolioInfo, setPortfolioInfo] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setCurrentUserId(session.user.id);
      } else {
        // When user logs out, fetch the latest portfolio data
        setCurrentUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchAllData();
    } else {
      // If no user is logged in, fetch the most recent portfolio data
      fetchLatestPortfolioData();
    }
  }, [currentUserId]);

  const getCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setCurrentUserId(session.user.id);
    } else {
      // If no user is logged in, fetch the latest portfolio data
      setCurrentUserId(null);
    }
  };

  const fetchLatestPortfolioData = async () => {
    try {
      // Fetch the most recent portfolio info
      const { data: portfolioData } = await supabase
        .from('portfolio_info')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (portfolioData) {
        setPortfolioInfo(portfolioData);
        
        // Fetch related data for this portfolio
        const userId = portfolioData.user_id;
        
        // Fetch projects for this user
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId)
          .eq('is_featured', true)
          .order('sort_order', { ascending: true });
        
        setProjects(projectsData || []);

        // Fetch skills for this user
        const { data: skillsData } = await supabase
          .from('skills')
          .select('*')
          .eq('user_id', userId)
          .order('category', { ascending: true })
          .order('sort_order', { ascending: true });
        
        setSkills(skillsData || []);

        // Fetch contact info for this user
        const { data: contactData } = await supabase
          .from('contact_info')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (contactData) {
          setContactInfo(contactData);
        }
      }
    } catch (error) {
      console.error('Error fetching latest portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchAllData = async () => {
    if (!currentUserId) return;
    
    try {
      // Fetch portfolio info for the current user
      const { data: portfolioData } = await supabase
        .from('portfolio_info')
        .select('*')
        .eq('user_id', currentUserId)
        .single();
      
      if (portfolioData) {
        setPortfolioInfo(portfolioData);
      }

      // Fetch projects for the current user
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true });
      
      setProjects(projectsData || []);

      // Fetch skills for the current user
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', currentUserId)
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });
      
      setSkills(skillsData || []);

      // Fetch contact info for the current user
      const { data: contactData } = await supabase
        .from('contact_info')
        .select('*')
        .eq('user_id', currentUserId)
        .single();
      
      if (contactData) {
        setContactInfo(contactData);
      }

    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    portfolioInfo,
    projects,
    skills,
    contactInfo,
    loading,
    refetch: fetchAllData,
    currentUserId,
  };
}