
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  DollarSign,
  Percent,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/StatsCard';
import RecentBets from '@/components/RecentBets';
import PerformanceChart from '@/components/PerformanceChart';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600">Monitora le tue performance di betting</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Profitto Totale"
          value="€1,245.50"
          trend="+12.5%"
          trendUp={true}
          icon={DollarSign}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatsCard
          title="ROI"
          value="15.7%"
          trend="+2.1%"
          trendUp={true}
          icon={Percent}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatsCard
          title="Scommesse Vinte"
          value="67/98"
          trend="68.4%"
          trendUp={true}
          icon={Target}
          iconColor="text-cyan-600"
          bgColor="bg-cyan-50"
        />
        <StatsCard
          title="Strike Rate"
          value="68.4%"
          trend="+5.2%"
          trendUp={true}
          icon={BarChart3}
          iconColor="text-indigo-600"
          bgColor="bg-indigo-50"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Andamento Profitto</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent Bets */}
        <div>
          <Card className="h-full border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-slate-600" />
                <span>Scommesse Recenti</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentBets />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Overview */}
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Riepilogo Mensile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-2xl font-bold text-green-700">€890.50</div>
              <div className="text-green-600 text-sm">Profitto Novembre</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">42</div>
              <div className="text-blue-600 text-sm">Scommesse Piazzate</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl">
              <div className="text-2xl font-bold text-cyan-700">71.4%</div>
              <div className="text-cyan-600 text-sm">Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
