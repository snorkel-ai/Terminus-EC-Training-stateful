-- Add disable_card column to promotions table for "Banner Only" mode
ALTER TABLE public.promotions
ADD COLUMN IF NOT EXISTS disable_card boolean DEFAULT false;

COMMENT ON COLUMN public.promotions.disable_card IS 'When true, promo appears as banner only (not as incentive card)';



