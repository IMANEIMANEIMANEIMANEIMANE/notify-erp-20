import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts: {
    all: number;
    finance: number;
    hr: number;
    stock: number;
    alerts: number;
  };
  stats: {
    totalToday: number;
    resolved: number;
    pending: number;
    overdue: number;
  };
}

const categories = [
  {
    id: "all",
    label: "Toutes les notifications",
    icon: TrendingUp,
    color: "primary"
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    color: "finance"
  },
  {
    id: "hr",
    label: "Ressources Humaines",
    icon: Users,
    color: "hr"
  },
  {
    id: "stock",
    label: "Stock & Inventaire",
    icon: Package,
    color: "stock"
  },
  {
    id: "alerts",
    label: "Alertes Système",
    icon: AlertTriangle,
    color: "alerts"
  }
];

const quickStats = [
  {
    id: "today",
    label: "Aujourd'hui",
    icon: Clock,
    color: "info"
  },
  {
    id: "resolved",
    label: "Résolues",
    icon: CheckCircle,
    color: "success"
  },
  {
    id: "pending",
    label: "En attente",
    icon: Clock,
    color: "warning"
  },
  {
    id: "overdue",
    label: "En retard",
    icon: XCircle,
    color: "destructive"
  }
];

export default function NotificationsSidebar({
  activeCategory,
  onCategoryChange,
  categoryCounts,
  stats
}: SidebarProps) {
  return (
    <div className="w-80 space-y-6">
      {/* Quick Stats */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Aperçu rapide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickStats.map((stat, index) => {
            const statValue = Object.values(stats)[index];
            return (
              <div
                key={stat.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}`} />
                  </div>
                  <span className="font-medium text-card-foreground">
                    {stat.label}
                  </span>
                </div>
                <Badge 
                  variant="secondary"
                  className={`bg-${stat.color}/10 text-${stat.color} border-${stat.color}/20`}
                >
                  {statValue}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Catégories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => {
            const count = categoryCounts[category.id as keyof typeof categoryCounts];
            const isActive = activeCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onCategoryChange(category.id)}
                className={`w-full justify-between h-auto p-3 ${
                  isActive
                    ? `bg-${category.color} text-${category.color}-foreground shadow-md`
                    : `hover:bg-${category.color}/10 hover:text-${category.color}`
                } transition-all duration-200`}
              >
                <div className="flex items-center gap-3">
                  <category.icon className="w-5 h-5" />
                  <span className="font-medium text-left">
                    {category.label}
                  </span>
                </div>
                
                {count > 0 && (
                  <Badge 
                    variant="secondary"
                    className={isActive 
                      ? "bg-background/20 text-current" 
                      : `bg-${category.color}/10 text-${category.color} border-${category.color}/20`
                    }
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-finance/5">
              <div className="w-2 h-2 rounded-full bg-finance"></div>
              <span>Nouvelle facture reçue</span>
              <span className="ml-auto text-xs">Il y a 5 min</span>
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-lg bg-hr/5">
              <div className="w-2 h-2 rounded-full bg-hr"></div>
              <span>Demande de congé approuvée</span>
              <span className="ml-auto text-xs">Il y a 15 min</span>
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-lg bg-stock/5">
              <div className="w-2 h-2 rounded-full bg-stock"></div>
              <span>Stock faible détecté</span>
              <span className="ml-auto text-xs">Il y a 1h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}