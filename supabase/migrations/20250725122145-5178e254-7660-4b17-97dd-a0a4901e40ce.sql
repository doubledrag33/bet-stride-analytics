-- Create storage bucket for bet images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bet-images', 'bet-images', true);

-- Create policies for bet images storage
CREATE POLICY "Anyone can view bet images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'bet-images');

CREATE POLICY "Users can upload their own bet images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'bet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own bet images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'bet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own bet images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'bet-images' AND auth.uid()::text = (storage.foldername(name))[1]);