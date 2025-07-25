import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      throw new Error('URL immagine richiesto');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key non configurata');
    }

    // Analyze image with OpenAI Vision
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Sei un esperto nell'analisi di scommesse sportive. Analizza l'immagine e estrai i seguenti dati in formato JSON:
            {
              "sport": "nome dello sport",
              "event": "descrizione dell'evento/partita",
              "bookmaker": "nome del bookmaker",
              "odds": "quota decimale (es: 2.50)",
              "stake": "importo puntato in euro",
              "adm_ref": "codice di riferimento ADM se presente",
              "confidence_score": "punteggio di confidenza da 1 a 100"
            }
            
            Se non riesci a identificare un campo, usa null. Rispondi SOLO con il JSON, senza testo aggiuntivo.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analizza questa immagine di scommessa e estrai i dati richiesti.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const extractedText = data.choices[0].message.content;
    
    // Parse JSON response
    let extractedData;
    try {
      extractedData = JSON.parse(extractedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', extractedText);
      throw new Error('Errore nel parsing della risposta AI');
    }

    // Validate and clean data
    const cleanedData = {
      sport: extractedData.sport || null,
      event: extractedData.event || null,
      bookmaker: extractedData.bookmaker || null,
      odds: extractedData.odds ? parseFloat(extractedData.odds) : null,
      stake: extractedData.stake ? parseFloat(extractedData.stake) : null,
      adm_ref: extractedData.adm_ref || null,
      confidence_score: extractedData.confidence_score ? parseInt(extractedData.confidence_score) : 50
    };

    console.log('Extracted data:', cleanedData);

    return new Response(JSON.stringify(cleanedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in parse-bet-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Errore nell\'analisi dell\'immagine',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});