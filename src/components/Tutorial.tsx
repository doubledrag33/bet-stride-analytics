
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  BookOpen, 
  DollarSign, 
  Target, 
  TrendingUp, 
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Euro
} from 'lucide-react';

interface TutorialProps {
  isOpen: boolean;
  onComplete: () => void;
}

const Tutorial = ({ isOpen, onComplete }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bankroll, setBankroll] = useState('');
  const [targetProfit, setTargetProfit] = useState('');

  const steps = [
    {
      title: "Benvenuto in BetTracker Pro!",
      icon: BookOpen,
      content: (
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">
            La tua analisi delle scommesse inizia qui
          </h3>
          <p className="text-slate-600">
            Questo tutorial ti guiderà nella configurazione iniziale e ti mostrerà come utilizzare 
            al meglio la piattaforma per tracciare e analizzare le tue scommesse sportive.
          </p>
        </div>
      )
    },
    {
      title: "Imposta il tuo Bankroll",
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <Euro className="w-16 h-16 text-blue-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-slate-800">
              Definisci il tuo budget
            </h3>
            <p className="text-slate-600">
              Il bankroll è l'importo totale che hai dedicato alle scommesse. 
              È fondamentale per calcolare correttamente i tuoi ROI e gestire il rischio.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankroll">Bankroll Iniziale (€)</Label>
              <Input
                id="bankroll"
                type="number"
                placeholder="es. 1000"
                value={bankroll}
                onChange={(e) => setBankroll(e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-slate-500 mt-1">
                Inserisci solo l'importo che puoi permetterti di perdere
              </p>
            </div>
            
            <div>
              <Label htmlFor="target">Obiettivo di Profitto Mensile (€)</Label>
              <Input
                id="target"
                type="number"
                placeholder="es. 100"
                value={targetProfit}
                onChange={(e) => setTargetProfit(e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-slate-500 mt-1">
                Un obiettivo realistico ti aiuterà a mantenere la disciplina
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Come compilare una scommessa",
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-slate-800">
              Registra ogni scommessa
            </h3>
            <p className="text-slate-600">
              Per un'analisi accurata, è importante inserire tutti i dettagli di ogni scommessa.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Campi obbligatori:</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• <strong>Sport:</strong> Categoria della scommessa</li>
                <li>• <strong>Evento:</strong> Partita o gara specifica</li>
                <li>• <strong>Tipo scommessa:</strong> Es. 1X2, Over/Under, BTTS</li>
                <li>• <strong>Quota:</strong> Moltiplicatore della vincita</li>
                <li>• <strong>Stake:</strong> Importo puntato</li>
                <li>• <strong>Bookmaker:</strong> Dove hai piazzato la scommessa</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Campi utili:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• <strong>Tipster:</strong> Se segui consigli di esperti</li>
                <li>• <strong>Note:</strong> Analisi personale o motivazione</li>
                <li>• <strong>Stato:</strong> In corso, vinta, persa, annullata</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pronto per iniziare!",
      icon: TrendingUp,
      content: (
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">
            Tutto configurato!
          </h3>
          <p className="text-slate-600">
            Ora puoi iniziare a tracciare le tue scommesse e analizzare le tue performance. 
            Ricorda: la costanza nell'inserimento dei dati è la chiave per analisi accurate.
          </p>
          <div className="bg-amber-50 p-4 rounded-lg mt-4">
            <p className="text-sm text-amber-800">
              <strong>Consiglio:</strong> Inserisci ogni scommessa subito dopo averla piazzata 
              per non dimenticare dettagli importanti.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save bankroll and target data (in a real app, this would go to a database)
      localStorage.setItem('bankroll', bankroll);
      localStorage.setItem('targetProfit', targetProfit);
      localStorage.setItem('tutorialCompleted', 'true');
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return bankroll && targetProfit && parseFloat(bankroll) > 0 && parseFloat(targetProfit) > 0;
    }
    return true;
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CurrentIcon className="w-6 h-6 text-blue-600" />
            <span>{steps[currentStep].title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {steps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Indietro</span>
            </Button>

            <span className="text-sm text-slate-500">
              {currentStep + 1} di {steps.length}
            </span>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <span>{currentStep === steps.length - 1 ? 'Completa' : 'Avanti'}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Tutorial;
