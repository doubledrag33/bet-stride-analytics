
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  trend, 
  trendUp, 
  icon: Icon, 
  iconColor = "text-blue-600",
  bgColor = "bg-blue-50"
}: StatsCardProps) => {
  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            {trend && (
              <p className={cn(
                "text-sm font-medium flex items-center space-x-1",
                trendUp ? "text-green-600" : "text-red-600"
              )}>
                <span>{trend}</span>
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", bgColor)}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
