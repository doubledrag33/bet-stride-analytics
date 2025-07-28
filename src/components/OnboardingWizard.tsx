import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Target, Upload, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bankrollName, setBankrollName] = useState('Bankroll Principale');
  const [profitTarget, setProfitTarget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const steps = [
    {
      title: 'Crea il tuo Bankroll',
      description: 'Imposta il nome del tuo bankroll principale',
      icon: Target
    },
    {
      title: 'Imposta il Target',
      description: 'Definisci il tuo obiettivo di profitto mensile',
      icon: TrendingUp
    },
    {
      title: 'Completa il Setup',
      description: 'Sei pronto per iniziare!',
      icon: Upload
    }
  ];

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Crea bankroll
      const { error: bankrollError } = await supabase
        .from('bankrolls')
        .insert({
          user_id: user.id,
          name: bankrollName
        });

      if (bankrollError) throw bankrollError;

      // Aggiorna profilo con target e onboarding completato
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          profit_target: profitTarget ? parseFloat(profitTarget) : null,
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Benvenuto in Smart Stake!",
        description: "Il tuo account è stato configurato con successo",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / 3) * 100;
  const CurrentIcon = steps[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-700 to-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <CurrentIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl text-gray-800">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {steps[currentStep - 1].description}
            </CardDescription>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Passo {currentStep} di 3</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankroll-name">Nome Bankroll</Label>
                <Input
                  id="bankroll-name"
                  value={bankrollName}
                  onChange={(e) => setBankrollName(e.target.value)}
                  placeholder="Es. Bankroll Principale"
                />
              </div>
              <p className="text-sm text-gray-600">
                Crea il tuo primo bankroll per iniziare a tracciare le tue scommesse.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profit-target">Target di Profitto Mensile (€)</Label>
                <Input
                  id="profit-target"
                  type="number"
                  step="0.01"
                  value={profitTarget}
                  onChange={(e) => setProfitTarget(e.target.value)}
                  placeholder="Es. 500"
                />
              </div>
              <p className="text-sm text-gray-600">
                Imposta un obiettivo di profitto mensile per monitorare i tuoi progressi. Puoi modificarlo in seguito.
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Tutto Pronto!</h3>
                <p className="text-gray-600">
                  Il tuo account Smart Stake è configurato. Ora puoi iniziare a caricare le tue scommesse e monitorare i tuoi profitti.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Indietro
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isLoading || (currentStep === 1 && !bankrollName.trim())}
              className="flex-1"
            >
              {isLoading ? 'Caricamento...' : currentStep === 3 ? 'Completa Setup' : 'Avanti'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWizard;