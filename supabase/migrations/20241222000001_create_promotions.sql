-- Create promotions table
CREATE TABLE IF NOT EXISTS public.promotions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    message text,
    categories text[] NOT NULL DEFAULT '{}',
    reward_multiplier numeric DEFAULT 1.0,
    variant text CHECK (variant IN ('info', 'success', 'warning', 'accent')) DEFAULT 'accent',
    is_active boolean DEFAULT false,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON public.promotions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for admins only" ON public.promotions
    FOR INSERT WITH CHECK (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );

CREATE POLICY "Enable update for admins only" ON public.promotions
    FOR UPDATE USING (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );

CREATE POLICY "Enable delete for admins only" ON public.promotions
    FOR DELETE USING (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );

-- View for active promotions
CREATE OR REPLACE VIEW public.v_active_promotions AS
SELECT *
FROM public.promotions
WHERE is_active = true
  AND (starts_at IS NULL OR starts_at <= now())
  AND (ends_at IS NULL OR ends_at >= now())
ORDER BY display_order ASC;

-- Update v_tasks_with_priorities to include promo info
DROP VIEW IF EXISTS public.v_tasks_with_priorities;

CREATE OR REPLACE VIEW public.v_tasks_with_priorities AS
SELECT 
    ti.id,
    ti.category,
    ti.subcategory,
    ti.subsubcategory,
    ti.title,
    ti.description,
    ti.difficulty,
    ti.tags,
    ti.created_at,
    CASE
        WHEN (st.id IS NOT NULL) THEN true
        ELSE false
    END AS is_selected,
    tp.is_highlighted,
    tp.priority_tag,
    tp.tag_label,
    tp.display_order,
    -- Promo fields
    (promo.id IS NOT NULL) as is_promoted,
    promo.reward_multiplier as promo_multiplier,
    promo.title as promo_title
FROM task_inspiration ti
LEFT JOIN selected_tasks st ON ti.id = st.task_id
LEFT JOIN task_priorities tp ON 
    (ti.category = tp.category) AND 
    ((tp.subcategory IS NULL) OR (ti.subcategory = tp.subcategory))
LEFT JOIN LATERAL (
    SELECT p.id, p.reward_multiplier, p.title
    FROM v_active_promotions p
    WHERE ti.category = ANY(p.categories)
    ORDER BY p.reward_multiplier DESC, p.display_order ASC
    LIMIT 1
) promo ON true;

