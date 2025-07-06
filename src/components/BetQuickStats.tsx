
import React from 'react';
import { Card } from '@/components/ui/card';

const BetQuickStats = () => {
  return (
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
  );
};

export default BetQuickStats;
