-- Add can_see_incentives flag to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS can_see_incentives boolean DEFAULT false;

COMMENT ON COLUMN public.profiles.can_see_incentives IS 'When true, user can see promotional banners and incentive cards';

