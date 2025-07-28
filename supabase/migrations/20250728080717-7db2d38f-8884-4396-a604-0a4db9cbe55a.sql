-- Aggiungi campi mancanti alla tabella profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_lang TEXT DEFAULT 'it';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dark_mode BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profit_target NUMERIC(12,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Aggiungi campo tipster alla tabella bets
ALTER TABLE bets ADD COLUMN IF NOT EXISTS tipster TEXT;

-- Crea funzione per gestire la creazione automatica del profilo
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, referral_code)
  VALUES (NEW.id, NEW.email, gen_random_uuid());
  RETURN NEW;
END;
$$;

-- Crea trigger per nuovi utenti
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Crea funzione per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aggiungi trigger per aggiornare updated_at sulle tabelle
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bankrolls_updated_at
  BEFORE UPDATE ON public.bankrolls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bets_updated_at
  BEFORE UPDATE ON public.bets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

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