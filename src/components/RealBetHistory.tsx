import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Filter, Download, Search, Loader2, Eye, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Bet {
  id: string;
  sport: string;
  event: string;
  bookmaker: string;
  tipster: string;
  odds: number;
  stake: number;
  status: 'PENDING' | 'WON' | 'LOST';
  placed_at: string;
  result_at: string;
  image_url: string;
  confidence_score: number;
}

const RealBetHistory = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'WON' | 'LOST'>('ALL');
  const [sportFilter, setSportFilter] = useState<string>('ALL');
  const [tipsterFilter, setTipsterFilter] = useState<string>('ALL');
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchBets = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('bets')
        .select('*')
        .eq('user_id', user.id)
        .order('placed_at', { ascending: false });

      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      }

      if (sportFilter !== 'ALL') {
        query = query.eq('sport', sportFilter);
      }

      if (tipsterFilter !== 'ALL') {
        query = query.eq('tipster', tipsterFilter);
      }

      if (searchTerm) {
        query = query.or(`event.ilike.%${searchTerm}%,bookmaker.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setBets(data || []);
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

  const updateBetStatus = async (betId: string, newStatus: 'WON' | 'LOST') => {
    try {
      const { error } = await supabase
        .from('bets')
        .update({ 
          status: newStatus,
          result_at: new Date().toISOString()
        })
        .eq('id', betId);

      if (error) throw error;

      setBets(prev => prev.map(bet => 
        bet.id === betId 
          ? { ...bet, status: newStatus, result_at: new Date().toISOString() }
          : bet
      ));

      toast({
        title: "Stato aggiornato",
        description: `Scommessa marcata come ${newStatus === 'WON' ? 'vinta' : 'persa'}`,
      });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    if (bets.length === 0) {
      toast({
        title: "Nessun dato",
        description: "Non ci sono scommesse da esportare",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Data', 'Sport', 'Evento', 'Bookmaker', 'Tipster', 'Quote', 'Puntata', 'Stato', 'Profitto'];
    const csvData = bets.map(bet => [
      new Date(bet.placed_at).toLocaleDateString('it-IT'),
      bet.sport || 'N/A',
      bet.event || 'N/A',
      bet.bookmaker || 'N/A',
      bet.tipster || 'N/A',
      bet.odds || 'N/A',
      bet.stake || 'N/A',
      bet.status,
      bet.status === 'WON' ? ((bet.odds * bet.stake) - bet.stake).toFixed(2) :
      bet.status === 'LOST' ? (-bet.stake).toFixed(2) : '0.00'
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-stake-bets-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WON': return 'bg-green-100 text-green-800';
      case 'LOST': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProfit = (bet: Bet) => {
    if (bet.status === 'WON') {
      return (bet.odds * bet.stake) - bet.stake;
    } else if (bet.status === 'LOST') {
      return -bet.stake;
    }
    return 0;
  };

  useEffect(() => {
    fetchBets();
  }, [user, statusFilter, sportFilter, tipsterFilter, searchTerm]);

  const uniqueSports = [...new Set(bets.map(bet => bet.sport).filter(Boolean))];
  const uniqueTipsters = [...new Set(bets.map(bet => bet.tipster).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Storico Scommesse</h1>
          <p className="text-blue-200">Gestisci e analizza le tue scommesse</p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Download className="h-4 w-4 mr-2" />
          Esporta CSV
        </Button>
      </div>

      {/* Filtri */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtri</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ricerca</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Cerca evento o bookmaker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Stato</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'ALL' | 'PENDING' | 'WON' | 'LOST')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tutti</SelectItem>
                  <SelectItem value="PENDING">In attesa</SelectItem>
                  <SelectItem value="WON">Vinte</SelectItem>
                  <SelectItem value="LOST">Perse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sport</label>
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tutti</SelectItem>
                  {uniqueSports.map(sport => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipster</label>
              <Select value={tipsterFilter} onValueChange={setTipsterFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tutti</SelectItem>
                  {uniqueTipsters.map(tipster => (
                    <SelectItem key={tipster} value={tipster}>{tipster}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista Scommesse */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Scommesse ({bets.length})</CardTitle>
          <CardDescription>
            Le tue scommesse ordinate per data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : bets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nessuna scommessa trovata</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bets.map((bet) => (
                <div
                  key={bet.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(bet.status)}>
                          {bet.status === 'PENDING' ? 'In attesa' : 
                           bet.status === 'WON' ? 'Vinta' : 'Persa'}
                        </Badge>
                        {bet.sport && (
                          <Badge variant="outline">{bet.sport}</Badge>
                        )}
                        {bet.tipster && (
                          <Badge variant="secondary">{bet.tipster}</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        {bet.event || 'Evento non specificato'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {bet.bookmaker} • Quote: {bet.odds} • Puntata: €{bet.stake}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(bet.placed_at).toLocaleDateString('it-IT')} alle {new Date(bet.placed_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className={`font-semibold ${
                          calculateProfit(bet) > 0 ? 'text-green-600' :
                          calculateProfit(bet) < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {calculateProfit(bet) > 0 ? '+' : ''}€{calculateProfit(bet).toFixed(2)}
                        </p>
                      </div>
                      
                      {bet.status === 'PENDING' && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBetStatus(bet.id, 'WON')}
                            className="text-green-600 hover:bg-green-50"
                          >
                            Vinta
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBetStatus(bet.id, 'LOST')}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Persa
                          </Button>
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(bet.image_url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealBetHistory;