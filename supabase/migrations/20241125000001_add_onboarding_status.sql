-- Add onboarding_completed column to profiles table
ALTER TABLE profiles 
ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;

COMMENT ON COLUMN profiles.onboarding_completed IS 'Tracks if the user has seen the initial onboarding modal';










