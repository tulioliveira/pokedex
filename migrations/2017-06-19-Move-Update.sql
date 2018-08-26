UPDATE move
SET description = REPLACE(description, '$effect_chance%', '')
WHERE description LIKE '%$effect_chance\%%';