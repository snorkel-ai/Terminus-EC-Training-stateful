/**
 * Video URLs configuration
 * 
 * Videos are hosted on Supabase Storage in the 'documentation-videos' bucket.
 * 
 * To update a video:
 * 1. Go to Supabase Dashboard → Storage → documentation-videos
 * 2. Upload the new video file
 * 3. Update the filename below
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ntmiycfydldoremofrbf.supabase.co';
const BUCKET_NAME = 'documentation-videos';

// Helper to generate public URL for a video in the bucket
const getVideoUrl = (filename) => 
  `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filename}`;

/**
 * Video URLs - update the filenames after uploading to Supabase Storage
 */
export const VIDEO_URLS = {
  // Office Hours 11/12 video (333 MB)
  officeHours1112: getVideoUrl('video1344882306.mp4'),
  
  // Expert Platform Onboarding video (166 MB)
  platformOnboarding: getVideoUrl('platform_onboarding_11-25-2025.mp4'),
  
  // General onboarding video
  onboardingVideo: getVideoUrl('video1251502681.mp4'),
  
  // Additional videos (upload if needed)
  gmtRecording: getVideoUrl('GMT20251218-190403_Recording_3440x1440.mp4'),
  onboarding1114: getVideoUrl('Onboarding_11-14-2025.mp4'),
  onboarding1105: getVideoUrl('Onboarding_11-5-25.mp4'),
  onboardingEdited: getVideoUrl('onboarding_edited.mp4'),
};

export default VIDEO_URLS;
