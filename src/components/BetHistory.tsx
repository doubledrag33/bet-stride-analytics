
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data delle scommesse
const mockBets = [
  {
    id: 1,
    date: '2024-01-15T14:30:00',
    sport: 'calcio',
    event: 'Milan vs Inter',
    bet: 'Over 2.5',
    odds: 1.85,
    stake: 50,
    bookmaker: 'bet365',
    tipster: 'Personale',
    status: 'won',
    profit: 42.5
  },
  {
    id: 2,
    date: '2024-01-14T20:45:00',
    sport: 'calcio',
    event: 'Juventus vs Napoli',
    bet: '1X',
    odds: 1.65,
    stake: 30,
    bookmaker: 'snai',
    tipster: 'ProTips',
    status: 'lost',
    profit: -30
  },
  {
    id: 3,
    date: '2024-01-12T16:00:00',
    sport: 'tennis',
    event: 'Djokovic vs Nadal',
    bet: '1',
    odds: 2.10,
    stake: 25,
    bookmaker: 'betfair',
    tipster: 'TennisExpert',
    status: 'won',
    profit: 27.5
  },
  {
    id: 4,
    date: '2024-01-10T19:30:00',
    sport: 'basket',
    event: 'Lakers vs Warriors',
    bet: 'Over 220.5',
    odds: 1.90,
    stake: 40,
    bookmaker: 'bet365',
    tipster: 'Personale',
    status: 'pending',
    profit: 0
  },
  {
    id: 5,
    date: '2023-12-28T15:15:00',
    sport: 'calcio',
    event: 'Roma vs Lazio',
    bet: 'BTTS',
    odds: 1.95,
    stake: 35,
    bookmaker: 'sisal',
    tipster: 'CalcioPro',
    status: 'won',
    profit: 33.25
  }
];

const BetHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('it-IT'),
      time: date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredBets = mockBets.filter(bet => {
    const betDate = new Date(bet.date);
    const betYear = betDate.getFullYear().toString();
    const betMonth = (betDate.getMonth() + 1).toString();

    const yearMatch = selectedYear === 'all' || betYear === selectedYear;
    const monthMatch = selectedMonth === 'all' || betMonth === selectedMonth;
    const statusMatch = selectedStatus === 'all' || bet.status === selectedStatus;

    return yearMatch && monthMatch && statusMatch;
  });

  const totalStake = filteredBets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalProfit = filteredBets.reduce((sum, bet) => sum + bet.profit, 0);
  const winRate = filteredBets.length > 0 ? 
    (filteredBets.filter(bet => bet.status === 'won').length / filteredBets.filter(bet => bet.status !== 'pending').length * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Storico Scommesse</h1>
        <p className="text-slate-600">Visualizza e analizza tutte le tue scommesse</p>
      </div>

      {/* Filtri */}
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span>Filtri</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Anno</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Mese</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="1">Gennaio</SelectItem>
                  <SelectItem value="2">Febbraio</SelectItem>
                  <SelectItem value="3">Marzo</SelectItem>
                  <SelectItem value="4">Aprile</SelectItem>
                  <SelectItem value="5">Maggio</SelectItem>
                  <SelectItem value="6">Giugno</SelectItem>
                  <SelectItem value="7">Luglio</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Settembre</SelectItem>
                  <SelectItem value="10">Ottobre</SelectItem>
                  <SelectItem value="11">Novembre</SelectItem>
                  <SelectItem value="12">Dicembre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Stato</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="won">Vinte</SelectItem>
                  <SelectItem value="lost">Perse</SelectItem>
                  <SelectItem value="pending">In corso</SelectItem>
                  <SelectItem value="void">Annullate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">&nbsp;</label>
              <Button 
                onClick={() => {
                  setSelectedMonth('all');
                  setSelectedYear('2024');
                  setSelectedStatus('all');
                }}
                variant="outline"
                className="w-full"
              >
                Reset Filtri
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiche Filtrate */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm text-center p-4">
          <div className="text-2xl font-bold text-blue-600">{filteredBets.length}</div>
          <div className="text-sm text-slate-600">Scommesse</div>
        </Card>
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm text-center p-4">
          <div className="text-2xl font-bold text-slate-700">€{totalStake}</div>
          <div className="text-sm text-slate-600">Stake Totale</div>
        </Card>
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm text-center p-4">
          <div className={cn(
            "text-2xl font-bold flex items-center justify-center space-x-1",
            totalProfit >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {totalProfit >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span>€{totalProfit}</span>
          </div>
          <div className="text-sm text-slate-600">Profitto</div>
        </Card>
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm text-center p-4">
          <div className="text-2xl font-bold text-cyan-600">{winRate}%</div>
          <div className="text-sm text-slate-600">Win Rate</div>
        </Card>
      </div>

      {/* Tabella Scommesse */}
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-slate-600" />
            <span>Scommesse ({filteredBets.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Ora</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Scommessa</TableHead>
                  <TableHead>Quota</TableHead>
                  <TableHead>Stake</TableHead>
                  <TableHead>Tipster</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Profitto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBets.map((bet) => {
                  const { date, time } = formatDateTime(bet.date);
                  return (
                    <TableRow key={bet.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{date}</div>
                          <div className="text-slate-500">{time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{bet.event}</div>
                          <div className="text-slate-500 capitalize">{bet.sport}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{bet.bet}</TableCell>
                      <TableCell>{bet.odds}</TableCell>
                      <TableCell>€{bet.stake}</TableCell>
                      <TableCell>{bet.tipster}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={bet.status === 'won' ? 'default' : bet.status === 'lost' ? 'destructive' : 'secondary'}
                          className={cn(
                            "text-xs",
                            bet.status === 'won' && "bg-green-100 text-green-700 hover:bg-green-100",
                            bet.status === 'pending' && "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                          )}
                        >
                          {bet.status === 'won' ? 'Vinta' : 
                           bet.status === 'lost' ? 'Persa' : 
                           bet.status === 'pending' ? 'In corso' : 'Annullata'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium",
                          bet.profit > 0 ? "text-green-600" : 
                          bet.profit < 0 ? "text-red-600" : "text-slate-500"
                        )}>
                          {bet.profit !== 0 && (bet.profit > 0 ? '+' : '')}€{bet.profit}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredBets.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Nessuna scommessa trovata con i filtri selezionati
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BetHistory;
