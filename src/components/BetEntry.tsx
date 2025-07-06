
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BetEntry = () => {
  const [formData, setFormData] = useState({
    sport: '',
    event: '',
    bet: '',
    odds: '',
    stake: '',
    bookmaker: '',
    status: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Scommessa salvata!",
      description: "La tua scommessa è stata aggiunta con successo.",
    });
    
    // Reset form
    setFormData({
      sport: '',
      event: '',
      bet: '',
      odds: '',
      stake: '',
      bookmaker: '',
      status: '',
      notes: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Nuova Scommessa</h1>
        <p className="text-slate-600">Inserisci i dettagli della tua scommessa</p>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <span>Dettagli Scommessa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sport and Event */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <Select value={formData.sport} onValueChange={(value) => handleInputChange('sport', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona sport" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="calcio">Calcio</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="basket">Basket</SelectItem>
                    <SelectItem value="volley">Volley</SelectItem>
                    <SelectItem value="altro">Altro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bookmaker">Bookmaker</Label>
                <Select value={formData.bookmaker} onValueChange={(value) => handleInputChange('bookmaker', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona bookmaker" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="bet365">Bet365</SelectItem>
                    <SelectItem value="snai">SNAI</SelectItem>
                    <SelectItem value="sisal">Sisal</SelectItem>
                    <SelectItem value="betfair">Betfair</SelectItem>
                    <SelectItem value="altro">Altro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Event */}
            <div className="space-y-2">
              <Label htmlFor="event">Evento</Label>
              <Input
                id="event"
                placeholder="es. Milan vs Inter"
                value={formData.event}
                onChange={(e) => handleInputChange('event', e.target.value)}
                className="bg-white/50"
              />
            </div>

            {/* Bet Details */}
            <div className="space-y-2">
              <Label htmlFor="bet">Tipo di Scommessa</Label>
              <Input
                id="bet"
                placeholder="es. Over 2.5, 1X, BTTS"
                value={formData.bet}
                onChange={(e) => handleInputChange('bet', e.target.value)}
                className="bg-white/50"
              />
            </div>

            {/* Odds and Stake */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="odds">Quota</Label>
                <Input
                  id="odds"
                  type="number"
                  step="0.01"
                  placeholder="es. 1.85"
                  value={formData.odds}
                  onChange={(e) => handleInputChange('odds', e.target.value)}
                  className="bg-white/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stake">Stake (€)</Label>
                <Input
                  id="stake"
                  type="number"
                  step="0.01"
                  placeholder="es. 50.00"
                  value={formData.stake}
                  onChange={(e) => handleInputChange('stake', e.target.value)}
                  className="bg-white/50"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Stato</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona stato" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="pending">In corso</SelectItem>
                  <SelectItem value="won">Vinta</SelectItem>
                  <SelectItem value="lost">Persa</SelectItem>
                  <SelectItem value="void">Annullata</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Note (opzionale)</Label>
              <Textarea
                id="notes"
                placeholder="Aggiungi note o analisi..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="bg-white/50 min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Salva Scommessa
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm text-center p-4">
          <div className="text-2xl font-bold text-blue-600">€50</div>
          <div className="text-sm text-slate-600">Stake Medio</div>
        </Card>
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm text-center p-4">
          <div className="text-2xl font-bold text-green-600">1.85</div>
          <div className="text-sm text-slate-600">Quota Media</div>
        </Card>
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm text-center p-4">
          <div className="text-2xl font-bold text-cyan-600">12</div>
          <div className="text-sm text-slate-600">Questo Mese</div>
        </Card>
      </div>
    </div>
  );
};

export default BetEntry;
