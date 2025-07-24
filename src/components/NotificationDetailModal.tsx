import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  User,
  Calendar,
  Paperclip,
  Circle,
  X,
  Download
} from "lucide-react";
import { type Notification } from "./NotificationCard";

interface NotificationDetailModalProps {
  notification: Notification | null;
  open: boolean;
  onClose: () => void;
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

export default function NotificationDetailModal({
  notification,
  open,
  onClose
}: NotificationDetailModalProps) {
  if (!notification) return null;

  const category = categoryConfig[notification.category];
  const status = statusConfig[notification.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {notification.status === 'urgent' && (
                  <Circle className="w-3 h-3 fill-destructive text-destructive animate-pulse" />
                )}
                <DialogTitle className="text-xl font-semibold leading-tight">
                  {notification.title}
                </DialogTitle>
                {notification.hasAttachment && (
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {/* Preview */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Aperçu</h4>
            <p className="text-card-foreground leading-relaxed">
              {notification.preview}
            </p>
          </div>

          {/* Full Details */}
          {notification.fullDetails && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Détails complets</h4>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-card-foreground leading-relaxed">
                  {notification.fullDetails}
                </p>
              </div>
            </div>
          )}

          {/* Attachment */}
          {notification.hasAttachment && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Pièce jointe</h4>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-dashed">
                <Paperclip className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-card-foreground flex-1">
                  Document_annexe.pdf
                </span>
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="w-3 h-3 mr-1" />
                  Télécharger
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Metadata */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Informations</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Soumis à:</span>
                <span className="font-medium text-card-foreground">{notification.submittedAt}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Émetteur:</span>
                <span className="font-medium text-card-foreground">{notification.sender}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expire le:</span>
                <span className="font-medium text-card-foreground">{notification.expiresAt}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}