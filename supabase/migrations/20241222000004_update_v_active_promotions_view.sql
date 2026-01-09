-- Recreate view to include disable_card and disable_banner columns
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
    disable_banner
FROM public.promotions
WHERE is_active = true
  AND (starts_at IS NULL OR starts_at <= now())
  AND (ends_at IS NULL OR ends_at >= now())
ORDER BY display_order ASC;



