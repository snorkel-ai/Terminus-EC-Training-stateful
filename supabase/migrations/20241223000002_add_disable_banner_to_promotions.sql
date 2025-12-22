-- Add disable_banner column to promotions table for "Card Only" mode
ALTER TABLE public.promotions
ADD COLUMN IF NOT EXISTS disable_banner boolean DEFAULT false;

COMMENT ON COLUMN public.promotions.disable_banner IS 'When true, promo appears as incentive card only (not in top banner)';

