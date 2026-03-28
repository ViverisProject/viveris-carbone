import { useState, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Home, Target, Users, User, Leaf, Car, UtensilsCrossed, Zap, TrendingDown, ChevronRight, Bell } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { motion } from "motion/react";
import { Navigation } from "./Navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";

import { Clock } from "lucide-react";
export function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Mobilité");
  const [consumptionDetail, setConsumptionDetail] = useState("");
  const [consumptionValue, setConsumptionValue] = useState("");
  const [oldConsumptions, setOldConsumptions] = useState([
    { categorie: "Transport", detail: "Trajet domicile-travail", date: "Hier", value: 4.2 },
    { categorie: "Alimentation", detail: "Repas végétarien", date: "Il y a 2 jours", value: 1.5 },
    { categorie: "Énergie", detail: "Chauffage", date: "Il y a 3 jours", value: 2.1 }
  ]);

  const getIconForCategory = (cat: string) => {
    switch(cat) {
      case 'Mobilité':
      case 'Transport': return Car;
      case 'Alimentation': return UtensilsCrossed;
      case 'Énergie': return Zap;
      case 'Mode de vie': return Leaf;
      default: return Leaf;
    }
  };

  const handleAddConsumption = () => {
    if (!consumptionDetail || !consumptionValue) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }
    const newValue = parseFloat(consumptionValue);
    if (isNaN(newValue)) {
      toast.error("Veuillez entrer une valeur valide (ex: 2.5).");
      return;
    }
    const newConso = {
      categorie: selectedCategory,
      detail: consumptionDetail,
      date: "Aujourd'hui",
      value: newValue
    };
    setOldConsumptions([newConso, ...oldConsumptions]);
    setIsAddModalOpen(false);
    setConsumptionDetail("");
    setConsumptionValue("");
    toast.success("Nouvelle consommation ajoutée !");
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Mock data
  const currentFootprint = 5.2;
  const targetFootprint = 2.3;
  const progress = ((currentFootprint - targetFootprint) / currentFootprint) * 100;

  const weeklyData = [
    { day: "Mon", value: 0.6 },
    { day: "Tue", value: 0.65 },
    { day: "Wed", value: 0.7 },
    { day: "Thu", value: 0.67 },
    { day: "Fri", value: 0.6 },
    { day: "Sat", value: 0.38 },
    { day: "Sun", value: 0.49 },
  ];

  const categories = [
      { name: "Mobilité", icon: Car },
      { name: "Alimentation", icon: UtensilsCrossed },
      { name: "Énergie", icon: Zap },
      { name: "Mode de vie", icon: Leaf },
  ];

  return (
    <div className="min-h-screen pb-32 md:pb-8 md:pl-64 lg:pl-72" style={{ backgroundColor: 'var(--viv-beige)' }}>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        {/* Header with User Avatar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pt-6 pb-4"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ background: 'linear-gradient(to bottom right, var(--viv-red), var(--viv-red-dark))' }}
            >
              {user?.firstName?.charAt(0) || "U"}
              {user?.lastName?.charAt(0) || ""}
            </div>
            <span className="font-bold text-lg md:text-xl" style={{ color: 'var(--viv-navy)' }}>
              {user?.firstName || "Robbin"}
            </span>
          </div>
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center">
            <Bell className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--viv-navy)' }} />
          </button>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Votre empreinte Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-semibold" style={{ color: 'var(--viv-navy)' }}>
                  Votre empreinte
                </h2>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
                  <span>LUN</span>
                  <span>24</span>
                  <span>JUILLET</span>
                  <Leaf className="w-4 h-4" />
                </div>
              </div>

              <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                Suivez vos activités pour voir comment elles contribuent à vos émissions de CO2.
              </p>

              {/* Consommations Actuelles */}
              <div className="mb-6 space-y-3">
                {[
                  { name: "Transport", value: 1.8, color: "#ff5046" },
                  { name: "Alimentation", value: 1.2, color: "#2a31d4" },
                  { name: "Énergie", value: 1.5, color: "#7e83e5" },
                  { name: "Consommation", value: 0.7, color: "#ff958f" }
                ].map((item, i) => (
                  <div key={`cons-${i}`} className="flex items-center justify-between p-3 rounded-lg bg-[var(--viv-beige)]/20 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium text-[var(--viv-navy)]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[var(--viv-navy)]">{item.value}t</span>
                      <button className="text-xs text-[var(--viv-secondary)] underline">Modifier</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="text-center">
                <div className="text-sm mb-1" style={{ color: '#64748B' }}>Total</div>
                <div className="text-4xl md:text-5xl mb-1" style={{ color: 'var(--viv-navy)' }}>4.98</div>
                <div className="text-sm" style={{ color: '#64748B' }}>Tonnes CO2</div>
              </div>
            </motion.div>

            {/* Add Your Consumption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--viv-navy)' }}>
                Ajouter une consommation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setIsAddModalOpen(true);
                        }}
                      className="flex items-center text-left w-full gap-3 p-4 rounded-2xl bg-white hover:shadow-md transition-all"
                      style={{ border: '1px solid rgba(30, 41, 59, 0.1)' }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(42, 49, 212, 0.1)' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: '#2a31d4' }} />
                      </div>
                      <span className="flex-1 font-medium" style={{ color: 'var(--viv-navy)' }}>
                        {category.name}
                      </span>
                      <ChevronRight className="w-5 h-5" style={{ color: '#94A3B8' }} />
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Mes anciennes consommations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--viv-navy)' }}>
                Mes anciennes consommations
              </h3>
              <div className="space-y-3">
                {oldConsumptions.map((item, index) => {
                  const Icon = getIconForCategory(item.categorie);
                  return (
                    <div key={`old-cons-${index}`} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(42, 49, 212, 0.1)' }}>
                          <Icon className="w-5 h-5" style={{ color: '#2a31d4' }} />
                        </div>
                        <div>
                          <div className="font-medium text-[var(--viv-navy)]">{item.categorie}</div>
                          <div className="text-xs text-gray-500">{item.detail} • {item.date}</div>
                        </div>
                      </div>
                      <div className="font-bold text-[var(--viv-navy)]">
                        +{item.value} <span className="text-xs font-normal text-gray-500">kg CO2</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Change History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--viv-navy)' }}>
                Historique des modifications
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Transport", date: "24 juil.", change: "+0.2t", type: "add" },
                  { title: "Alimentation", date: "22 juil.", change: "-0.1t", type: "sub" }
                ].map((log, i) => (
                  <div key={`log-${i}`} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-[var(--viv-beige)]/30 text-[var(--viv-secondary)]">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-[var(--viv-navy)]">{log.title}</div>
                        <div className="text-xs text-gray-500">{log.date}</div>
                      </div>
                    </div>
                    <span className={`font-bold ${log.type === 'sub' ? 'text-green-600' : 'text-[var(--viv-red)]'}`}>
                      {log.change}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div>
            {/* Conseils Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--viv-navy)' }}>
                Conseils
              </h3>
              <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                Voici des conseils personnalisés pour réduire votre empreinte carbone.
              </p>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-3xl shadow-lg p-5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: 'rgba(42, 49, 212, 0.1)' }}
                  >
                    <UtensilsCrossed className="w-6 h-6" style={{ color: '#2a31d4' }} />
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--viv-navy)' }}>
                    Manger local
                  </h4>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                    Acheter de la nourriture locale réduit de beaucoup votre empreinte de transport.
                  </p>
                  <button 
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: '#2a31d4' }}
                  >
                    En savoir plus
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(42, 49, 212, 0.1)' }}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: 'rgba(42, 49, 212, 0.1)' }}
                  >
                    <Car className="w-6 h-6" style={{ color: '#2a31d4' }} />
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--viv-navy)' }}>
                    Utiliser les transports en commun
                  </h4>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                    Choisissez les transports en commun ou le covoiturage pour réduire les émissions.
                  </p>
                  <button 
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: '#2a31d4' }}
                  >
                    En savoir plus
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(42, 49, 212, 0.1)' }}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dialog d'ajout de conso */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]" style={{ borderRadius: '1.5rem', backgroundColor: 'white' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--viv-navy)' }}>
              Ajouter une conso : {selectedCategory}
            </DialogTitle>
            <DialogDescription>
              Entrez le détail de votre action et l'estimation de CO2 (en kg).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="detail" className="text-sm font-medium" style={{ color: 'var(--viv-navy)' }}>
                Détail de l'action
              </label>
              <input
                id="detail"
                value={consumptionDetail}
                onChange={(e) => setConsumptionDetail(e.target.value)}
                placeholder="ex: Trajet Paris-Lyon en TGV"
                className="w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2"
                style={{
                  border: '1px solid rgba(78, 175, 137, 0.3)', backgroundColor: 'white',
                  '--tw-ring-color': 'var(--viv-red)'
                } as any}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="value" className="text-sm font-medium" style={{ color: 'var(--viv-navy)' }}>
                Quantité de CO2 (kg)
              </label>
              <input
                id="value"
                type="number"
                step="0.1"
                min="0"
                value={consumptionValue}
                onChange={(e) => setConsumptionValue(e.target.value)}
                placeholder="ex: 4.5"
                className="w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2"
                style={{
                  border: '1px solid rgba(78, 175, 137, 0.3)', backgroundColor: 'white',
                  '--tw-ring-color': 'var(--viv-red)'
                } as any}
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={handleAddConsumption}
              className="px-6 py-2 rounded-xl text-white font-medium transition-colors hover:opacity-90 w-full md:w-auto"
              style={{ backgroundColor: 'var(--viv-navy)' }}
            >
              Ajouter à mon historique
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Navigation currentPage="dashboard" />
    </div>
  );
}



