import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  User,
  Calendar,
  Eye,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Circle
} from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  preview: string;
  fullDetails?: string;
  submittedAt: string;
  sender: string;
  expiresAt: string;
  status: "unread" | "read" | "urgent";
  category: "finance" | "hr" | "stock" | "alerts";
  hasAttachment?: boolean;
  isPinned?: boolean;
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const categoryConfig = {
  finance: { label: "Finance", color: "bg-blue-100 text-blue-800 border-blue-200" },
  hr: { label: "HR", color: "bg-green-100 text-green-800 border-green-200" },
  stock: { label: "Stock", color: "bg-orange-100 text-orange-800 border-orange-200" },
  alerts: { label: "Alerts", color: "bg-red-100 text-red-800 border-red-200" }
};

const statusConfig = {
  unread: { label: "Non lu", color: "bg-primary/10 text-primary border-primary/20" },
  read: { label: "Lu", color: "bg-muted text-muted-foreground border-border" },
  urgent: { label: "Urgent", color: "bg-destructive/10 text-destructive border-destructive/20" }
};

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onView
}: NotificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
    toast({
      title: "Notification marquée comme lue",
      description: "Mise à jour avec succès",
    });
  };

  const handleDelete = () => {
    onDelete(notification.id);
    toast({
      title: "Notification supprimée",
      description: "Mise à jour avec succès",
      variant: "destructive",
    });
  };

  const handleView = () => {
    onView(notification.id);
  };

  const category = categoryConfig[notification.category];
  const status = statusConfig[notification.status];

  return (
    <Card className={`group transition-all duration-200 hover:shadow-medium hover:-translate-y-1 ${
      notification.status === 'unread' ? 'border-l-4 border-l-primary bg-primary/5' : ''
    } ${notification.isPinned ? 'ring-2 ring-accent/20' : ''}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {notification.status === 'urgent' && (
                <Circle className="w-2 h-2 fill-urgent text-urgent animate-pulse" />
              )}
              <h3 className="font-semibold text-card-foreground text-lg group-hover:text-primary transition-colors">
                {notification.title}
              </h3>
              {notification.hasAttachment && (
                <Paperclip className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            
            {/* Category and Status */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge 
                variant="secondary" 
                className={category.color}
              >
                {category.label}
              </Badge>
              <Badge 
                variant="outline"
                className={status.color}
              >
                {status.label}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {notification.status === 'unread' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                className="h-8 w-8 p-0 hover:bg-success/10 hover:text-success"
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preview */}
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {notification.preview}
        </p>

        {/* Expandable Details */}
        {notification.fullDetails && (
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 p-0 text-primary hover:text-primary/80 font-medium"
            >
              {isExpanded ? (
                <>
                  Réduire <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Voir plus <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
            
            {isExpanded && (
              <div className="mt-3 p-4 bg-muted/50 rounded-lg animate-fade-in">
                <p className="text-card-foreground leading-relaxed">
                  {notification.fullDetails}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Timestamp Row */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Soumis à</span>
            <span className="font-medium">{notification.submittedAt}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <User className="w-4 h-4 shrink-0" />
            <span>Émetteur</span>
            <span className="font-medium">{notification.sender}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Jusqu'à</span>
            <span className="font-medium">{notification.expiresAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}