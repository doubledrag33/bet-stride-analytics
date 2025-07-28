-- Aggiungi campi mancanti alla tabella profiles (solo se non esistono)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_lang TEXT DEFAULT 'it';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dark_mode BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profit_target NUMERIC(12,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Aggiungi campo tipster alla tabella bets (solo se non esiste)
ALTER TABLE bets ADD COLUMN IF NOT EXISTS tipster TEXT;

-- Crea funzione RPC per analytics
CREATE OR REPLACE FUNCTION public.get_analytics(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_bets', (SELECT COUNT(*) FROM bets WHERE user_id = p_user_id),
    'won_bets', (SELECT COUNT(*) FROM bets WHERE user_id = p_user_id AND status = 'WON'),
    'lost_bets', (SELECT COUNT(*) FROM bets WHERE user_id = p_user_id AND status = 'LOST'),
    'pending_bets', (SELECT COUNT(*) FROM bets WHERE user_id = p_user_id AND status = 'PENDING'),
    'total_staked', (SELECT COALESCE(SUM(stake), 0) FROM bets WHERE user_id = p_user_id),
    'total_profit', (SELECT COALESCE(SUM(CASE 
      WHEN status = 'WON' THEN (stake * odds) - stake
      WHEN status = 'LOST' THEN -stake
      ELSE 0
    END), 0) FROM bets WHERE user_id = p_user_id),
    'win_rate', (SELECT CASE 
      WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE status = 'WON'))::DECIMAL / COUNT(*) * 100
      ELSE 0
    END FROM bets WHERE user_id = p_user_id AND status != 'PENDING'),
    'roi', (SELECT CASE 
      WHEN SUM(stake) > 0 THEN 
        (SUM(CASE 
          WHEN status = 'WON' THEN (stake * odds) - stake
          WHEN status = 'LOST' THEN -stake
          ELSE 0
        END) / SUM(stake)) * 100
      ELSE 0
    END FROM bets WHERE user_id = p_user_id),
    'monthly_data', (
      SELECT json_agg(json_build_object(
        'month', to_char(date_trunc('month', placed_at), 'YYYY-MM'),
        'profit', COALESCE(SUM(CASE 
          WHEN status = 'WON' THEN (stake * odds) - stake
          WHEN status = 'LOST' THEN -stake
          ELSE 0
        END), 0),
        'bets_count', COUNT(*)
      ) ORDER BY date_trunc('month', placed_at))
      FROM bets 
      WHERE user_id = p_user_id 
      AND placed_at >= date_trunc('month', current_date - interval '11 months')
      GROUP BY date_trunc('month', placed_at)
    ),
    'sport_distribution', (
      SELECT json_agg(json_build_object(
        'sport', COALESCE(sport, 'Altro'),
        'count', COUNT(*),
        'profit', COALESCE(SUM(CASE 
          WHEN status = 'WON' THEN (stake * odds) - stake
          WHEN status = 'LOST' THEN -stake
          ELSE 0
        END), 0)
      ))
      FROM bets 
      WHERE user_id = p_user_id
      GROUP BY sport
    )
  ) INTO result;
  
  RETURN result;
END;
$$;