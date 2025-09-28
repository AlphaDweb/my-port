-- Add unique constraint on user_id for portfolio_info table
-- This ensures each user can only have one portfolio_info record
ALTER TABLE public.portfolio_info 
ADD CONSTRAINT portfolio_info_user_id_unique UNIQUE (user_id);
