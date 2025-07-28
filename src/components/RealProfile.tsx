import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { User, Target, Globe, Moon, Save, LogOut } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

const RealProfile = () => {
  const { profile, updateProfile } = useProfile();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    profit_target: profile?.profit_target?.toString() || '',
    preferred_lang: profile?.preferred_lang || 'it',
    dark_mode: profile?.dark_mode || false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const success = await updateProfile({
        profit_target: formData.profit_target ? parseFloat(formData.profit_target) : null,
        preferred_lang: formData.preferred_lang,
        dark_mode: formData.dark_mode,
      });

      if (success) {
        toast({
          title: "Profilo aggiornato",
          description: "Le tue impostazioni sono state salvate",
        });
      }
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout effettuato",
        description: "Alla prossima!",
      });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Profilo</h1>
          <p className="text-blue-200">Gestisci le tue impostazioni</p>
        </div>
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Caricamento profilo...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Profilo</h1>
        <p className="text-blue-200">Gestisci le tue impostazioni</p>
      </div>

      {/* Informazioni Account */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Informazioni Account</span>
          </CardTitle>
          <CardDescription>
            Dettagli del tuo account Smart Stake
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Codice Referral</Label>
              <div className="flex space-x-2">
                <Input value={profile.referral_code} disabled />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}?ref=${profile.referral_code}`);
                    toast({
                      title: "Link copiato!",
                      description: "Il link referral è stato copiato negli appunti",
                    });
                  }}
                >
                  Copia Link
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Account creato il: {new Date(profile.created_at).toLocaleDateString('it-IT')}</p>
            {profile.invited_by && (
              <p>Invitato da: {profile.invited_by}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Impostazioni */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Impostazioni</span>
          </CardTitle>
          <CardDescription>
            Personalizza la tua esperienza
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profit-target">Target di Profitto Mensile (€)</Label>
            <Input
              id="profit-target"
              type="number"
              step="0.01"
              placeholder="Es. 500"
              value={formData.profit_target}
              onChange={(e) => setFormData(prev => ({ ...prev, profit_target: e.target.value }))}
            />
            <p className="text-sm text-gray-600">
              Imposta il tuo obiettivo di profitto mensile per monitorare i progressi
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center space-x-2">
                <Moon className="h-4 w-4" />
                <span>Tema Scuro</span>
              </Label>
              <p className="text-sm text-gray-600">
                Attiva il tema scuro dell'interfaccia
              </p>
            </div>
            <Switch
              checked={formData.dark_mode}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, dark_mode: checked }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Lingua Preferita</span>
            </Label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.preferred_lang}
              onChange={(e) => setFormData(prev => ({ ...prev, preferred_lang: e.target.value }))}
            >
              <option value="it">Italiano</option>
              <option value="en">English</option>
            </select>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Salvataggio...' : 'Salva Impostazioni'}
          </Button>
        </CardContent>
      </Card>

      {/* Abbonamento */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Abbonamento</CardTitle>
          <CardDescription>
            Stato del tuo abbonamento Premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold">
                {profile.subscription_active ? 'Premium Attivo' : 'Account Gratuito'}
              </p>
              {profile.subscription_end && (
                <p className="text-sm text-gray-600">
                  Scade il: {new Date(profile.subscription_end).toLocaleDateString('it-IT')}
                </p>
              )}
            </div>
            <Button variant="outline">
              {profile.subscription_active ? 'Gestisci Abbonamento' : 'Aggiorna a Premium'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="pt-6">
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealProfile;