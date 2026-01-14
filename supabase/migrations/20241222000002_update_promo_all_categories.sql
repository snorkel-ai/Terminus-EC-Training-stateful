-- Update v_tasks_with_priorities to support 'ALL' category promos
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
    WHERE 
        ('ALL' = ANY(p.categories)) OR  -- Match if promo is for ALL
        (ti.category = ANY(p.categories)) -- Match if promo is for specific category
    ORDER BY p.reward_multiplier DESC, p.display_order ASC
    LIMIT 1
) promo ON true;

