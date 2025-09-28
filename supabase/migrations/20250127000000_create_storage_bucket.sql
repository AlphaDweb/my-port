-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true);

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portfolio-images' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow anyone to view images
CREATE POLICY "Anyone can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-images');

-- Create policy to allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update their own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portfolio-images' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portfolio-images' 
  AND auth.role() = 'authenticated'
);
