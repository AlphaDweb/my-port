import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const portfolioInfoSchema = z.object({
  website_name: z.string().min(1, 'Website name is required'),
  hero_title: z.string().min(1, 'Hero title is required'),
  hero_subtitle: z.string().min(1, 'Hero subtitle is required'),
  about_title: z.string().min(1, 'About title is required'),
  about_content: z.string().min(1, 'About content is required'),
  journey_title: z.string().min(1, 'Journey title is required'),
  journey_content: z.string().min(1, 'Journey content is required'),
  journey_technologies: z.string().min(1, 'Journey technologies are required'),
});

interface PortfolioInfoFormProps {
  userId?: string;
  onDataSaved?: () => void;
}

export function PortfolioInfoForm({ userId, onDataSaved }: PortfolioInfoFormProps) {
  const [formData, setFormData] = useState({
    website_name: '',
    hero_title: '',
    hero_subtitle: '',
    about_title: '',
    about_content: '',
    profile_image_url: '',
    journey_title: '',
    journey_content: '',
    journey_technologies: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchPortfolioInfo();
    }
  }, [userId]);

  const fetchPortfolioInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_info')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      if (data) {
        setFormData({
          website_name: data.website_name || '',
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          about_title: data.about_title || '',
          about_content: data.about_content || '',
          profile_image_url: data.profile_image_url || '',
          journey_title: data.journey_title || '',
          journey_content: data.journey_content || '',
          journey_technologies: data.journey_technologies || '',
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load portfolio information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      portfolioInfoSchema.parse({
        website_name: formData.website_name,
        hero_title: formData.hero_title,
        hero_subtitle: formData.hero_subtitle,
        about_title: formData.about_title,
        about_content: formData.about_content,
        journey_title: formData.journey_title,
        journey_content: formData.journey_content,
        journey_technologies: formData.journey_technologies,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        hero_image_url: null, // Use default background image
        user_id: userId,
      };

      // First, try to update existing record
      const { data: existingData, error: selectError } = await supabase
        .from('portfolio_info')
        .select('id')
        .eq('user_id', userId)
        .single();

      let error;
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('portfolio_info')
          .update(dataToSave)
          .eq('user_id', userId);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('portfolio_info')
          .insert(dataToSave);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Portfolio information updated successfully",
      });

      // Trigger data refresh
      if (onDataSaved) {
        onDataSaved();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Information</CardTitle>
        <CardDescription>
          Update your website's main content and information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website_name">Website Name</Label>
              <Input
                id="website_name"
                value={formData.website_name}
                onChange={(e) => handleInputChange('website_name', e.target.value)}
                placeholder="My Portfolio"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hero_title">Main Heading (Your Name/Title)</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                placeholder="John Doe - Full Stack Developer"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subtitle">Subtitle/Tagline</Label>
            <Input
              id="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
              placeholder="Passionate about creating innovative solutions"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about_title">About Section Heading</Label>
            <Input
              id="about_title"
              value={formData.about_title}
              onChange={(e) => handleInputChange('about_title', e.target.value)}
              placeholder="About Me"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about_content">About Me Description</Label>
            <Textarea
              id="about_content"
              value={formData.about_content}
              onChange={(e) => handleInputChange('about_content', e.target.value)}
              placeholder="Write a brief description about yourself, your background, skills, and what you do..."
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <ImageUpload
              value={formData.profile_image_url}
              onChange={(url) => handleInputChange('profile_image_url', url)}
              label="Profile Image"
              placeholder="Click to upload your profile image or drag and drop"
              maxSize={5}
              aspectRatio={1}
              enableCrop={true}
              cropShape="round"
            />
          </div>

          {/* Journey Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">My Journey Section</h3>
            
            <div className="space-y-2">
              <Label htmlFor="journey_title">Journey Section Title</Label>
              <Input
                id="journey_title"
                value={formData.journey_title}
                onChange={(e) => handleInputChange('journey_title', e.target.value)}
                placeholder="My Journey"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="journey_content">Journey Description</Label>
              <Textarea
                id="journey_content"
                value={formData.journey_content}
                onChange={(e) => handleInputChange('journey_content', e.target.value)}
                placeholder="Tell your story about your journey in development..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="journey_technologies">Technologies (comma-separated)</Label>
              <Input
                id="journey_technologies"
                value={formData.journey_technologies}
                onChange={(e) => handleInputChange('journey_technologies', e.target.value)}
                placeholder="React, TypeScript, Node.js, Python, AWS"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}