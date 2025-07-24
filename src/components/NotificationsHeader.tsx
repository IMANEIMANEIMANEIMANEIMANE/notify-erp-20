import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Info,
  CheckCheck,
  Trash2,
  Grid,
  List,
  SlidersHorizontal
} from "lucide-react";

interface NotificationsHeaderProps {
  totalCount: number;
  unreadCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
}

const filters = [
  { id: "all", label: "Tous", count: 0 },
  { id: "unread", label: "Non lus", count: 0 },
  { id: "urgent", label: "Urgent", count: 0 },
  { id: "expired", label: "Expirés", count: 0 }
];

export default function NotificationsHeader({
  totalCount,
  unreadCount,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onMarkAllAsRead,
  onDeleteAll
}: NotificationsHeaderProps) {
  const { toast } = useToast();

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
    toast({
      title: "Toutes les notifications marquées comme lues",
      description: "Mise à jour avec succès",
    });
  };

  const handleDeleteAll = () => {
    onDeleteAll();
    toast({
      title: "Toutes les notifications supprimées",
      description: "Mise à jour avec succès",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Title Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <Info className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground px-3 py-1 rounded-full">
              {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-8 w-8 p-0"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="h-8 w-8 p-0"
          >
            <Grid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une notification…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
          />
        </div>

        {/* Bulk Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="bg-card hover:bg-success/10 hover:text-success hover:border-success/30"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Marquer tout comme lu
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAll}
            disabled={totalCount === 0}
            className="bg-card hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer tout
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-card hover:bg-muted/80"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className={`rounded-full px-4 py-2 transition-all duration-200 ${
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card hover:bg-muted/80 hover:border-primary/30"
            }`}
          >
            {filter.label}
            {filter.id === "all" && totalCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-background/20 text-xs">
                {totalCount}
              </Badge>
            )}
            {filter.id === "unread" && unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-background/20 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}