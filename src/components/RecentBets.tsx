
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const recentBets = [
  {
    id: 1,
    event: 'Milan vs Inter',
    bet: 'Over 2.5',
    stake: 50,
    odds: 1.85,
    status: 'won',
    profit: 42.5,
    date: '2 ore fa'
  },
  {
    id: 2,
    event: 'Juventus vs Napoli',
    bet: '1X',
    stake: 30,
    odds: 1.65,
    status: 'lost',
    profit: -30,
    date: '5 ore fa'
  },
  {
    id: 3,
    event: 'Roma vs Lazio',
    bet: 'BTTS',
    stake: 25,
    odds: 1.95,
    status: 'won',
    profit: 23.75,
    date: '1 giorno fa'
  },
  {
    id: 4,
    event: 'Atalanta vs Fiorentina',
    bet: '2',
    stake: 40,
    odds: 2.15,
    status: 'pending',
    profit: 0,
    date: 'Live'
  },
];

const RecentBets = () => {
  return (
    <div className="space-y-4">
      {recentBets.map((bet) => (
        <div key={bet.id} className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors duration-200">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 text-sm">{bet.event}</h4>
              <p className="text-xs text-slate-600">{bet.bet} • {bet.odds}</p>
            </div>
            <Badge 
              variant={bet.status === 'won' ? 'default' : bet.status === 'lost' ? 'destructive' : 'secondary'}
              className={cn(
                "text-xs",
                bet.status === 'won' && "bg-green-100 text-green-700 hover:bg-green-100",
                bet.status === 'pending' && "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
              )}
            >
              {bet.status === 'won' ? 'Vinta' : bet.status === 'lost' ? 'Persa' : 'In corso'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Stake: €{bet.stake}</span>
            <div className="flex items-center space-x-2">
              <span className={cn(
                "font-medium",
                bet.profit > 0 ? "text-green-600" : bet.profit < 0 ? "text-red-600" : "text-slate-500"
              )}>
                {bet.profit !== 0 && (bet.profit > 0 ? '+' : '')}€{bet.profit}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{bet.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentBets;
