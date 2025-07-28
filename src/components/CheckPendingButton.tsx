import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CheckPendingButton = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleCheckPending = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-pending');

      if (error) throw error;

      toast({
        title: "Controllo completato",
        description: `${data.message}`,
      });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Controllo Scommesse Pendenti</span>
        </CardTitle>
        <CardDescription>
          Verifica automaticamente lo stato delle scommesse in attesa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <div className="text-sm text-blue-800">
            Il controllo automatico viene eseguito ogni ora per aggiornare lo stato delle scommesse.
          </div>
        </div>
        
        <Button 
          onClick={handleCheckPending}
          disabled={isChecking}
          className="w-full"
          size="lg"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Controllo in corso...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Controlla Ora
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-600 text-center">
          Ultima verifica automatica: ogni ora
        </p>
      </CardContent>
    </Card>
  );
};

export default CheckPendingButton;