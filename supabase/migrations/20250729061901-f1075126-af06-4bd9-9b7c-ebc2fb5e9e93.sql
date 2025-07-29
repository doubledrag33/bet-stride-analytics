-- Fix the get_analytics function to resolve nested aggregation error
CREATE OR REPLACE FUNCTION public.get_analytics(p_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result JSON;
  total_bets_count INTEGER;
  won_bets_count INTEGER;
  lost_bets_count INTEGER;
  pending_bets_count INTEGER;
  total_staked_amount NUMERIC;
  total_profit_amount NUMERIC;
  win_rate_percent NUMERIC;
  roi_percent NUMERIC;
BEGIN
  -- Get basic counts and totals
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'WON'),
    COUNT(*) FILTER (WHERE status = 'LOST'),
    COUNT(*) FILTER (WHERE status = 'PENDING'),
    COALESCE(SUM(stake), 0),
    COALESCE(SUM(CASE 
      WHEN status = 'WON' THEN (stake * odds) - stake
      WHEN status = 'LOST' THEN -stake
      ELSE 0
    END), 0)
  INTO total_bets_count, won_bets_count, lost_bets_count, pending_bets_count, total_staked_amount, total_profit_amount
  FROM bets 
  WHERE user_id = p_user_id;
  
  -- Calculate win rate
  SELECT CASE 
    WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE status = 'WON'))::NUMERIC / COUNT(*) * 100
    ELSE 0
  END INTO win_rate_percent
  FROM bets 
  WHERE user_id = p_user_id AND status != 'PENDING';
  
  -- Calculate ROI
  SELECT CASE 
    WHEN SUM(stake) > 0 THEN 
      (SUM(CASE 
        WHEN status = 'WON' THEN (stake * odds) - stake
        WHEN status = 'LOST' THEN -stake
        ELSE 0
      END) / SUM(stake)) * 100
    ELSE 0
  END INTO roi_percent
  FROM bets 
  WHERE user_id = p_user_id;
  
  SELECT json_build_object(
    'total_bets', total_bets_count,
    'won_bets', won_bets_count,
    'lost_bets', lost_bets_count,
    'pending_bets', pending_bets_count,
    'total_staked', total_staked_amount,
    'total_profit', total_profit_amount,
    'win_rate', COALESCE(win_rate_percent, 0),
    'roi', COALESCE(roi_percent, 0),
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
$function$