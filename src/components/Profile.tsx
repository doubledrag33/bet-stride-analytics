
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Target, Settings, Bell, Shield, Moon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailAlerts: true,
    monthlyTarget: '1000',
    maxStake: '100'
  });

  const handleSave = () => {
    toast({
      title: "Impostazioni salvate!",
      description: "Le tue preferenze sono state aggiornate con successo.",
    });
  };

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Profilo</h1>
        <p className="text-slate-600">Gestisci le tue preferenze e impostazioni</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Informazioni Personali</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Marco Rossi</h3>
                  <p className="text-sm text-slate-600">marco.rossi@email.com</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Membro dal</span>
                  <span className="font-medium">Gennaio 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Scommesse totali</span>
                  <span className="font-medium">98</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Win Rate</span>
                  <span className="font-medium text-green-600">68.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-700">€1,245.50</div>
              <div className="text-green-600 text-sm">Profitto Totale</div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Settings */}
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Obiettivi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyTarget">Target Mensile (€)</Label>
                  <Input
                    id="monthlyTarget"
                    type="number"
                    value={settings.monthlyTarget}
                    onChange={(e) => handleSettingChange('monthlyTarget', e.target.value)}
                    className="bg-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStake">Stake Massimo (€)</Label>
                  <Input
                    id="maxStake"
                    type="number"
                    value={settings.maxStake}
                    onChange={(e) => handleSettingChange('maxStake', e.target.value)}
                    className="bg-white/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span>Preferenze App</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-slate-600" />
                    <span className="font-medium">Notifiche Push</span>
                  </div>
                  <p className="text-sm text-slate-600">Ricevi notifiche per scommesse e aggiornamenti</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(value) => handleSettingChange('notifications', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-slate-600" />
                    <span className="font-medium">Modalità Scura</span>
                  </div>
                  <p className="text-sm text-slate-600">Attiva il tema scuro dell'applicazione</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(value) => handleSettingChange('darkMode', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-slate-600" />
                    <span className="font-medium">Alert Email</span>
                  </div>
                  <p className="text-sm text-slate-600">Ricevi email per risultati importanti</p>
                </div>
                <Switch
                  checked={settings.emailAlerts}
                  onCheckedChange={(value) => handleSettingChange('emailAlerts', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Salva Impostazioni
            </Button>
            <Button variant="outline" className="flex-1">
              Esporta Dati
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Riepilogo Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">98</div>
              <div className="text-blue-600 text-sm">Scommesse Totali</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-2xl font-bold text-green-700">67</div>
              <div className="text-green-600 text-sm">Scommesse Vinte</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl">
              <div className="text-2xl font-bold text-cyan-700">15.7%</div>
              <div className="text-cyan-600 text-sm">ROI</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
              <div className="text-2xl font-bold text-indigo-700">€47</div>
              <div className="text-indigo-600 text-sm">Stake Medio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
