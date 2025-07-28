import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all pending bets older than 24 hours
    const { data: pendingBets, error: fetchError } = await supabase
      .from('bets')
      .select('id, event, sport, bookmaker, placed_at')
      .eq('status', 'PENDING')
      .lt('placed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (fetchError) throw fetchError;

    console.log(`Found ${pendingBets?.length || 0} pending bets to check`);

    let updatedCount = 0;

    // For demo purposes, randomly update some bets
    // In a real app, you would integrate with sports betting APIs
    for (const bet of pendingBets || []) {
      // Simulate random result (60% win rate for demo)
      const isWin = Math.random() > 0.4;
      const newStatus = isWin ? 'WON' : 'LOST';

      const { error: updateError } = await supabase
        .from('bets')
        .update({
          status: newStatus,
          result_at: new Date().toISOString()
        })
        .eq('id', bet.id);

      if (!updateError) {
        updatedCount++;
        console.log(`Updated bet ${bet.id} to ${newStatus}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Checked ${pendingBets?.length || 0} pending bets, updated ${updatedCount}`,
      checked: pendingBets?.length || 0,
      updated: updatedCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in check-pending function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Errore nel controllo delle scommesse pendenti',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});