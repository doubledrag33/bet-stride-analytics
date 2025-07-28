import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, Target, BarChart, Loader2, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBar, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import StatsCard from '@/components/StatsCard';

interface AnalyticsData {
  total_bets: number;
  won_bets: number;
  lost_bets: number;
  pending_bets: number;
  total_staked: number;
  total_profit: number;
  win_rate: number;
  roi: number;
  monthly_data: Array<{
    month: string;
    profit: number;
    bets_count: number;
  }>;
  sport_distribution: Array<{
    sport: string;
    count: number;
    profit: number;
  }>;
}

const RealAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_analytics', {
        p_user_id: user.id
      });

      if (error) throw error;

      setAnalytics(data as unknown as AnalyticsData);
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

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-blue-200">Analizza le tue performance</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-blue-200">Analizza le tue performance</p>
        </div>
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nessun dato disponibile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const monthlyChartData = analytics.monthly_data?.map(item => ({
    ...item,
    month: new Date(item.month + '-01').toLocaleDateString('it-IT', { month: 'short', year: '2-digit' })
  })) || [];

  const cumulativeData = monthlyChartData.reduce((acc, curr, index) => {
    const cumulative = index === 0 ? curr.profit : acc[index - 1].cumulative + curr.profit;
    acc.push({ ...curr, cumulative });
    return acc;
  }, [] as any[]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-blue-200">Analizza le tue performance</p>
        </div>
        <Button 
          onClick={fetchAnalytics}
          variant="outline" 
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Aggiorna
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Profitto Totale"
          value={`€${analytics.total_profit.toFixed(2)}`}
          trend={analytics.total_profit >= 0 ? "+€" + Math.abs(analytics.total_profit).toFixed(2) : "-€" + Math.abs(analytics.total_profit).toFixed(2)}
          trendUp={analytics.total_profit >= 0}
          icon={analytics.total_profit >= 0 ? TrendingUp : TrendingDown}
          iconColor={analytics.total_profit >= 0 ? "text-green-600" : "text-red-600"}
          bgColor={analytics.total_profit >= 0 ? "bg-green-50" : "bg-red-50"}
        />
        
        <StatsCard
          title="Win Rate"
          value={`${analytics.win_rate.toFixed(1)}%`}
          trend={`${analytics.won_bets}/${analytics.won_bets + analytics.lost_bets} vinte`}
          trendUp={analytics.win_rate >= 50}
          icon={Target}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />

        <StatsCard
          title="ROI"
          value={`${analytics.roi.toFixed(1)}%`}
          trend={analytics.roi >= 0 ? "Positivo" : "Negativo"}
          trendUp={analytics.roi >= 0}
          icon={BarChart}
          iconColor={analytics.roi >= 0 ? "text-green-600" : "text-red-600"}
          bgColor={analytics.roi >= 0 ? "bg-green-50" : "bg-red-50"}
        />

        <StatsCard
          title="Totale Puntato"
          value={`€${analytics.total_staked.toFixed(2)}`}
          trend={`${analytics.total_bets} scommesse`}
          icon={TrendingUp}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profitto Cumulativo */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Profitto Cumulativo</CardTitle>
            <CardDescription>Andamento del profitto nel tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `€${value}`} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value) => [`€${value}`, 'Profitto Cumulativo']}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Profitto Mensile */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Profitto Mensile</CardTitle>
            <CardDescription>Profitto per mese</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBar data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `€${value}`} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value) => [`€${value}`, 'Profitto']}
                  />
                  <Bar dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </RechartsBar>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuzione Sport */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Distribuzione per Sport</CardTitle>
            <CardDescription>Numero di scommesse per sport</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.sport_distribution}
                    dataKey="count"
                    nameKey="sport"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ sport, count }) => `${sport}: ${count}`}
                  >
                    {analytics.sport_distribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance per Sport */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Performance per Sport</CardTitle>
            <CardDescription>Profitto per categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.sport_distribution?.map((sport, index) => (
                <div key={sport.sport} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{sport.sport}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${sport.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sport.profit >= 0 ? '+' : ''}€{sport.profit.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">{sport.count} scommesse</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealAnalytics;