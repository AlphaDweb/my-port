import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const contactInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
});

interface ContactInfoFormProps {
  userId?: string;
  onDataSaved?: () => void;
}

export function ContactInfoForm({ userId, onDataSaved }: ContactInfoFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchContactInfo();
    }
  }, [userId]);

  const fetchContactInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      if (data) {
        setFormData(data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load contact information",
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
      contactInfoSchema.parse({ email: formData.email });
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
        user_id: userId,
      };

      // Check if a record exists for this user_id
      const { data: existingRows, error: selectError } = await supabase
        .from('contact_info')
        .select('id')
        .eq('user_id', userId);

      if (selectError) throw selectError;

      if (existingRows && existingRows.length > 0) {
        // Update existing row
        const { error: updateError } = await supabase
          .from('contact_info')
          .update(dataToSave)
          .eq('user_id', userId);

        if (updateError) throw updateError;
      } else {
        // Insert new row
        const { error: insertError } = await supabase
          .from('contact_info')
          .insert(dataToSave);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success!",
        description: "Contact information updated successfully",
      });
      onDataSaved?.();
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
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Update your contact details and social media links
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="hello@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Media Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input
                id="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                placeholder="https://twitter.com/username"
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