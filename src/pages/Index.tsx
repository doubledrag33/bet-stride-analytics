
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, DollarSign, Target, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CheckPendingButton from '@/components/CheckPendingButton';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Benvenuto in Smart Stake
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
          Trasforma le tue scommesse in dati strutturati e ottimizza le tue strategie
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scommesse Totali</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">0</div>
            <p className="text-xs text-muted-foreground">+0 da ieri</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profitto Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">€0.00</div>
            <p className="text-xs text-muted-foreground">+0% questo mese</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">0%</div>
            <p className="text-xs text-muted-foreground">Ultima settimana</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">0%</div>
            <p className="text-xs text-muted-foreground">Percentuale vincite</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PlusCircle className="h-5 w-5 text-blue-600" />
              <span>Aggiungi Scommessa</span>
            </CardTitle>
            <CardDescription>
              Carica la foto della tua scommessa e lascia che l'AI estragga i dati
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/bets/new')}
              className="w-full"
              size="lg"
            >
              Nuova Scommessa
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Tutorial</span>
            </CardTitle>
            <CardDescription>
              Scopri come ottenere il massimo da Smart Stake
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => navigate('/tutorial')}
              className="w-full"
              size="lg"
            >
              Inizia Tutorial
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Check Pending Button */}
      <CheckPendingButton />

      {/* Recent Activity Placeholder */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Attività Recente</CardTitle>
          <CardDescription>
            Le tue ultime scommesse appariranno qui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nessuna scommessa ancora. Inizia caricando la tua prima scommessa!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
