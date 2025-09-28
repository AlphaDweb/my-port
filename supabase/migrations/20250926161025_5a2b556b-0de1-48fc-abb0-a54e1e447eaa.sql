-- Create portfolio_info table for general website information
CREATE TABLE public.portfolio_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  website_name TEXT NOT NULL DEFAULT 'Portfolio',
  hero_title TEXT NOT NULL DEFAULT 'Welcome to My Portfolio',
  hero_subtitle TEXT NOT NULL DEFAULT 'Building Amazing Digital Experiences',
  about_title TEXT NOT NULL DEFAULT 'About Me',
  about_content TEXT NOT NULL DEFAULT 'I am a passionate developer...',
  hero_image_url TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL, -- 'frontend', 'backend', 'tools'
  name TEXT NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_info table
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to manage their own content
CREATE POLICY "Users can view all portfolio info" 
ON public.portfolio_info FOR SELECT USING (true);

CREATE POLICY "Users can manage their own portfolio info" 
ON public.portfolio_info FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view all projects" 
ON public.projects FOR SELECT USING (true);

CREATE POLICY "Users can manage their own projects" 
ON public.projects FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view all skills" 
ON public.skills FOR SELECT USING (true);

CREATE POLICY "Users can manage their own skills" 
ON public.skills FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view all contact info" 
ON public.contact_info FOR SELECT USING (true);

CREATE POLICY "Users can manage their own contact info" 
ON public.contact_info FOR ALL USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_portfolio_info_updated_at
BEFORE UPDATE ON public.portfolio_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
BEFORE UPDATE ON public.contact_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data (this will be customizable via admin)
INSERT INTO public.portfolio_info (user_id, website_name, hero_title, hero_subtitle, about_title, about_content)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder user_id, will be replaced when user signs up
  'My Portfolio',
  'Creative Developer & Designer',
  'Building Amazing Digital Experiences',
  'About Me',
  'I am a passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions that solve real-world problems and deliver exceptional user experiences.'
);

INSERT INTO public.contact_info (user_id, email, phone, location, github_url, linkedin_url)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'hello@example.com',
  '+1 (555) 123-4567',
  'San Francisco, CA',
  'https://github.com/username',
  'https://linkedin.com/in/username'
);