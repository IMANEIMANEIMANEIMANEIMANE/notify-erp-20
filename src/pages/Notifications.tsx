import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import NotificationCard, { type Notification } from "@/components/NotificationCard";
import NotificationsHeader from "@/components/NotificationsHeader";
import NotificationsSidebar from "@/components/NotificationsSidebar";
import NotificationDetailModal from "@/components/NotificationDetailModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouvelle facture ajoutée",
    preview: "Une nouvelle facture de €2,450.00 a été ajoutée au système par Marie Dubois.",
    fullDetails: "Facture #FAC-2024-0156 d'un montant de €2,450.00 HT (€2,940.00 TTC) pour la société TechCorp. Cette facture concerne la prestation de conseil IT du mois de janvier 2024. Documents annexes: contrat signé, bon de commande, et rapport de prestations.",
    submittedAt: "09:30",
    sender: "Marie Dubois",
    expiresAt: "31/01/2024",
    status: "unread",
    category: "finance",
    hasAttachment: true,
    isPinned: true
  },
  {
    id: "2",
    title: "Demande de congé en attente",
    preview: "Jean Martin a soumis une demande de congé du 15 au 25 février 2024.",
    fullDetails: "Demande de congé payé pour 10 jours ouvrables. Motif: vacances familiales. Solde de congés restant: 18 jours. Manager direct: Sophie Laurent. Cette demande nécessite une validation avant le 10 février.",
    submittedAt: "14:15",
    sender: "Jean Martin",
    expiresAt: "10/02/2024",
    status: "urgent",
    category: "hr",
    hasAttachment: false
  },
  {
    id: "3",
    title: "Stock faible - Papier A4",
    preview: "Le stock de papier A4 est descendu sous le seuil critique (5 paquets restants).",
    fullDetails: "Produit: Papier A4 80g/m² blanc - Référence: PAP-A4-80. Stock actuel: 5 unités. Seuil d'alerte: 10 unités. Fournisseur recommandé: Bureau Plus. Délai de livraison habituel: 3 jours ouvrés. Dernière commande: 15 décembre 2023 (50 unités).",
    submittedAt: "11:45",
    sender: "Système Stock",
    expiresAt: "05/02/2024",
    status: "unread",
    category: "stock",
    hasAttachment: false
  },
  {
    id: "4",
    title: "Maintenance serveur programmée",
    preview: "Maintenance du serveur principal prévue ce weekend (03/02 - 04/02).",
    fullDetails: "Maintenance préventive du serveur principal SRV-001. Durée estimée: 4 heures. Impact: arrêt complet des services de 02h00 à 06h00 le samedi 03/02. Services concernés: ERP, messagerie, base de données clients. Équipe technique: Service IT externe (TechMaintenance).",
    submittedAt: "16:20",
    sender: "Admin Système",
    expiresAt: "03/02/2024",
    status: "read",
    category: "alerts",
    hasAttachment: true
  },
  {
    id: "5",
    title: "Rapport mensuel disponible",
    preview: "Le rapport financier de janvier 2024 est maintenant disponible.",
    fullDetails: "Rapport financier mensuel - Janvier 2024. Chiffre d'affaires: €125,680. Charges: €89,340. Résultat net: €36,340 (+12% vs décembre). Principaux indicateurs: CA/employé, taux de marge, évolution trésorerie. Analyse détaillée des écarts budgétaires incluse.",
    submittedAt: "08:30",
    sender: "Comptabilité",
    expiresAt: "28/02/2024",
    status: "read",
    category: "finance",
    hasAttachment: true
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const itemsPerPage = 6;

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilter !== "all") {
      if (activeFilter === "expired") {
        // Mock expired logic - notifications past their expiry date
        filtered = filtered.filter(() => Math.random() > 0.8);
      } else {
        filtered = filtered.filter((notification) => notification.status === activeFilter);
      }
    }

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter((notification) => notification.category === activeCategory);
    }

    return filtered;
  }, [notifications, searchQuery, activeFilter, activeCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = useMemo(() => {
    const unreadCount = notifications.filter((n) => n.status === "unread").length;
    const categoryCounts = {
      all: notifications.length,
      finance: notifications.filter((n) => n.category === "finance").length,
      hr: notifications.filter((n) => n.category === "hr").length,
      stock: notifications.filter((n) => n.category === "stock").length,
      alerts: notifications.filter((n) => n.category === "alerts").length,
    };

    return {
      unreadCount,
      categoryCounts,
      quickStats: {
        totalToday: notifications.length,
        resolved: notifications.filter((n) => n.status === "read").length,
        pending: notifications.filter((n) => n.status === "unread").length,
        overdue: Math.floor(notifications.length * 0.1), // Mock data
      },
    };
  }, [notifications]);

  // Handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, status: "read" as const }
          : notification
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleView = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      setSelectedNotification(notification);
      setIsModalOpen(true);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, status: "read" as const }))
    );
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1800px] mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <NotificationsSidebar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categoryCounts={stats.categoryCounts}
              stats={stats.quickStats}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <NotificationsHeader
              totalCount={notifications.length}
              unreadCount={stats.unreadCount}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDeleteAll={handleDeleteAll}
            />

            {/* Notifications Grid/List */}
            {paginatedNotifications.length > 0 ? (
              <div
                className={`grid gap-4 sm:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                } animate-fade-in`}
              >
                {paginatedNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    Aucune notification trouvée
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery || activeFilter !== "all" || activeCategory !== "all"
                      ? "Essayez de modifier vos filtres ou votre recherche."
                      : "Vous n'avez aucune notification pour le moment."}
                  </p>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-card hover:bg-muted/80"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Précédent
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 p-0 ${
                        currentPage === i + 1
                          ? "bg-primary text-primary-foreground"
                          : "bg-card hover:bg-muted/80"
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-card hover:bg-muted/80"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}