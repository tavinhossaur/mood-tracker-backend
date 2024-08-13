-- Procedure to update user streak based on his moods
CREATE OR REPLACE PROCEDURE calculate_average_coordinates(p_user_id UUID)
LANGUAGE plpgsql
AS $$
DECLARE
    average_coordinates JSON;
BEGIN
    -- Calcular as coordenadas médias diretamente usando JSON_ARRAY
    SELECT JSON_BUILD_ARRAY(
            COALESCE(ROUND(AVG((coordinates->>0)::NUMERIC)), 0),
            COALESCE(ROUND(AVG((coordinates->>1)::NUMERIC)), 0)
        ) INTO average_coordinates
    FROM (
        SELECT 
            CASE mood_value
                WHEN '0' THEN JSON_ARRAY(6, 1)
                WHEN '1' THEN JSON_ARRAY(6, 2)
                WHEN '2' THEN JSON_ARRAY(6, 3)
                WHEN '3' THEN JSON_ARRAY(6, 4)
                WHEN '4' THEN JSON_ARRAY(6, 5)
                WHEN '5' THEN JSON_ARRAY(6, 6)
                WHEN '6' THEN JSON_ARRAY(5, 1)
                WHEN '7' THEN JSON_ARRAY(5, 2)
                WHEN '8' THEN JSON_ARRAY(5, 3)
                WHEN '9' THEN JSON_ARRAY(5, 4)
                WHEN '10' THEN JSON_ARRAY(5, 5)
                WHEN '11' THEN JSON_ARRAY(5, 6)
                WHEN '12' THEN JSON_ARRAY(4, 1)
                WHEN '13' THEN JSON_ARRAY(4, 2)
                WHEN '14' THEN JSON_ARRAY(4, 3)
                WHEN '15' THEN JSON_ARRAY(4, 4)
                WHEN '16' THEN JSON_ARRAY(4, 5)
                WHEN '17' THEN JSON_ARRAY(4, 6)
                WHEN '18' THEN JSON_ARRAY(3, 1)
                WHEN '19' THEN JSON_ARRAY(3, 2)
                WHEN '20' THEN JSON_ARRAY(3, 3)
                WHEN '21' THEN JSON_ARRAY(3, 4)
                WHEN '22' THEN JSON_ARRAY(3, 5)
                WHEN '23' THEN JSON_ARRAY(3, 6)
                WHEN '24' THEN JSON_ARRAY(2, 1)
                WHEN '25' THEN JSON_ARRAY(2, 2)
                WHEN '26' THEN JSON_ARRAY(2, 3)
                WHEN '27' THEN JSON_ARRAY(2, 4)
                WHEN '28' THEN JSON_ARRAY(2, 5)
                WHEN '29' THEN JSON_ARRAY(2, 6)
                WHEN '30' THEN JSON_ARRAY(1, 1)
                WHEN '31' THEN JSON_ARRAY(1, 2)
                WHEN '32' THEN JSON_ARRAY(1, 3)
                WHEN '33' THEN JSON_ARRAY(1, 4)
                WHEN '34' THEN JSON_ARRAY(1, 5)
                WHEN '35' THEN JSON_ARRAY(1, 6)
                ELSE JSON_ARRAY(0, 0)
            END AS coordinates
        FROM "Mood"
        WHERE "Mood".user_id = p_user_id
        ORDER BY created_at DESC
        LIMIT 5
    ) AS subquery;

    -- Verificar se o cálculo foi bem-sucedido e atualizar o campo streak
    IF average_coordinates IS NOT NULL THEN
        UPDATE "User"
        SET streak = average_coordinates
        WHERE id = p_user_id;
    ELSE
        UPDATE "User"
        SET streak = JSON_ARRAY(0, 0)
        WHERE id = p_user_id;
    END IF;
END;
$$;

--------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------

-- Function where a trigger that runs the procedure to update user streak is returned
CREATE OR REPLACE FUNCTION trigger_call_procedure()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    -- Chama a procedure usando CALL
    CALL calculate_average_coordinates(NEW.user_id);
    RETURN NEW;
END;
$$;

--------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------

-- Trigger that runs when user creates a new mood register
CREATE TRIGGER mood_insert_trigger
AFTER INSERT ON "Mood"
FOR EACH ROW
EXECUTE FUNCTION trigger_call_procedure();

--------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------

-- Function that creates a profile preferences register when a user is created
CREATE OR REPLACE FUNCTION create_profile_preferences() 
RETURNS TRIGGER AS $$
DECLARE
    new_profile_preferences_id UUID;
BEGIN
    -- Cria uma nova instância de ProfilePreferences com uma imagem padrão ou NULL
    INSERT INTO "ProfilePreferences" (id, profile_img)
    VALUES (gen_random_uuid(), NULL) -- Aqui você pode substituir `NULL` por uma imagem padrão se desejar
    RETURNING id INTO new_profile_preferences_id;

    -- Atualiza o usuário recém-criado para linkar com o novo ProfilePreferences
    UPDATE "User"
    SET profile_preferences_id = new_profile_preferences_id
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------

-- Trigger that is called when a user is created
CREATE TRIGGER user_insert_trigger
AFTER INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION create_profile_preferences();
