-- Add show_rain_animation column to promotions table
ALTER TABLE public.promotions
ADD COLUMN IF NOT EXISTS show_rain_animation boolean DEFAULT true;

COMMENT ON COLUMN public.promotions.show_rain_animation IS 'When true, shows animated falling money emojis on the banner';

-- Recreate view to include the new column
CREATE OR REPLACE VIEW public.v_active_promotions AS
SELECT 
    id,
    title,
    message,
    long_description,
    categories,
    reward_multiplier,
    variant,
    is_active,
    starts_at,
    ends_at,
    display_order,
    created_at,
    updated_at,
    disable_card,
    disable_banner,
    show_rain_animation
FROM public.promotions
WHERE is_active = true
  AND (starts_at IS NULL OR starts_at <= now())
  AND (ends_at IS NULL OR ends_at >= now())
ORDER BY display_order ASC;

