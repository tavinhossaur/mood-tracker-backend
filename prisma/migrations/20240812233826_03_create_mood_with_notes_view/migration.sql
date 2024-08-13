-- View to show the moods registered by the user with it's respective notes
CREATE VIEW mood_with_notes AS
SELECT 
    m.mood_value,
    m.created_at AS mood_date,
    n.text_content
FROM 
    "Mood" m
LEFT JOIN 
    "Notes" n
ON 
    m.id = n.mood_id;