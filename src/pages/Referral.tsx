import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, Users, Gift, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Referral = () => {
  const [profile, setProfile] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProfile();
      loadReferrals();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, created_at, subscription_active')
        .eq('invited_by', profile?.referral_code);

      if (error) throw error;
      setReferrals(data || []);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!profile?.referral_code) return;
    
    const referralLink = `${window.location.origin}?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    
    toast({
      title: "Link copiato",
      description: "Il link di referral è stato copiato negli appunti",
    });
  };

  const copyReferralCode = () => {
    if (!profile?.referral_code) return;
    
    navigator.clipboard.writeText(profile.referral_code);
    
    toast({
      title: "Codice copiato",
      description: "Il codice referral è stato copiato negli appunti",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Sistema Referral</h1>
        <p className="text-blue-200">Invita amici e guadagna insieme</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inviti Totali</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{referrals.length}</div>
            <p className="text-xs text-muted-foreground">Persone invitate</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abbonamenti Attivi</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {referrals.filter(r => r.subscription_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Referral premium</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bonus Guadagnati</CardTitle>
            <Gift className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              €{(referrals.filter(r => r.subscription_active).length * 5).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">€5 per referral premium</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Il Tuo Codice Referral</CardTitle>
          <CardDescription>
            Condividi questo codice con i tuoi amici per invitarli su Smart Stake
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={profile?.referral_code || ''}
              readOnly
              className="font-mono text-lg"
            />
            <Button onClick={copyReferralCode} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Link di invito completo:</p>
            <div className="flex items-center space-x-2">
              <Input
                value={`${window.location.origin}?ref=${profile?.referral_code || ''}`}
                readOnly
                className="text-sm"
              />
              <Button onClick={copyReferralLink} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Come funziona:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• I tuoi amici si registrano usando il tuo codice</li>
              <li>• Ricevono 7 giorni di prova gratuita extra</li>
              <li>• Tu guadagni €5 per ogni abbonamento premium</li>
              <li>• Nessun limite al numero di referral</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Referral List */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>I Tuoi Referral</CardTitle>
          <CardDescription>
            Persone che si sono registrate usando il tuo codice
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nessun referral ancora. Inizia a condividere il tuo codice!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{referral.email}</p>
                    <p className="text-sm text-gray-500">
                      Registrato il {new Date(referral.created_at).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <Badge 
                    variant={referral.subscription_active ? "default" : "secondary"}
                  >
                    {referral.subscription_active ? "Premium" : "Gratuito"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Referral;