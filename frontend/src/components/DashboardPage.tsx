import { useState, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Car, UtensilsCrossed, Zap, Leaf, ChevronRight, X } from "lucide-react";
import { motion } from "motion/react";
import { Navigation } from "./Navigation";

export function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>({ name: "", icon: Leaf, numericValue: 0 });
  const [consumptionValue, setConsumptionValue] = useState("");
  
  const [categoryTotals, setCategoryTotals] = useState({
    "Mobilité": 1.7, 
    "Alimentation": 1.2, 
    "Énergie": 1.5, 
    "Mode de vie": 0.68
  });

  const [recentModifications, setRecentModifications] = useState<any[]>([
    { name: "Mobilité", date: "01/03/2026", value: "+0.1t", icon: Car },
    { name: "Alimentation", date: "15/02/2026", value: "-0.05t", icon: UtensilsCrossed },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedQuiz = sessionStorage.getItem("quizResult");
    if (storedQuiz) {
      const parsed = JSON.parse(storedQuiz);
      setQuizResult(parsed);
      if (parsed.answers) {
        const ans = parsed.answers;
        setCategoryTotals({
          "Mobilité": (((ans[1]?.co2 || 0) + (ans[2]?.co2 || 0)) / 1000) || 1.7,
          "Alimentation": (((ans[3]?.co2 || 0) + (ans[4]?.co2 || 0)) / 1000) || 1.2,
          "Énergie": (((ans[5]?.co2 || 0) + (ans[6]?.co2 || 0)) / 1000) || 1.5,
          "Mode de vie": (((ans[7]?.co2 || 0) + (ans[8]?.co2 || 0)) / 1000) || 0.68
        });
      }
    }
  }, []);

  const displayTotal = Object.values(categoryTotals).reduce((a, b) => a + b, 0).toFixed(2);

  const consumptions = [
    { name: "Mobilité", value: categoryTotals["Mobilité"].toFixed(2) + "t", numericValue: categoryTotals["Mobilité"], icon: Car },
    { name: "Alimentation", value: categoryTotals["Alimentation"].toFixed(2) + "t", numericValue: categoryTotals["Alimentation"], icon: UtensilsCrossed },
    { name: "Énergie", value: categoryTotals["Énergie"].toFixed(2) + "t", numericValue: categoryTotals["Énergie"], icon: Zap },
    { name: "Mode de vie", value: categoryTotals["Mode de vie"].toFixed(2) + "t", numericValue: categoryTotals["Mode de vie"], icon: Leaf },
  ];

  const handleOpenModal = (item: any) => {
    setSelectedCategory(item);
    setIsModalOpen(true);
    setConsumptionValue(item.numericValue.toString());
  };

  const handleSaveModification = () => {
    if (consumptionValue === "" || isNaN(Number(consumptionValue)) || Number(consumptionValue) < 0) {
       toast.error("Veuillez entrer une valeur valide (positive).");
       return;
    }
    
    const newVal = Number(consumptionValue);
    const oldVal = selectedCategory.numericValue;
    const diffNum = newVal - oldVal;

    if(diffNum === 0) {
       toast.info("Aucune modification effectuée.");
       setIsModalOpen(false);
       return;
    }

    setCategoryTotals(prev => ({
      ...prev,
      [selectedCategory.name]: newVal
    }));

    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth()+1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    const valStr = diffNum > 0 ? `+${diffNum.toFixed(2)}t` : `${diffNum.toFixed(2)}t`;
    
    setRecentModifications(prev => [
      { name: selectedCategory.name, date: dateStr, value: valStr, icon: selectedCategory.icon },
      ...prev.slice(0, 3)
    ]);
    
    toast.success(`Modification pour ${selectedCategory.name} enregistrée !`);
    setIsModalOpen(false);
  };

  const IconBox = ({ icon: Icon }: { icon: any }) => (
    <div className="w-8 h-8 rounded-full flex items-center justify-center min-w-[2rem]" style={{ backgroundColor: 'rgba(42, 49, 212, 0.1)', color: 'var(--viv-secondary)' }}>
      <Icon className="w-4 h-4" />
    </div>
  );

  return (
    <div className="min-h-screen pb-32 md:pb-8 md:pl-64 lg:pl-72" style={{ backgroundColor: 'var(--viv-beige)' }}>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-2xl ml-0">  
        {/* Header with User Avatar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 pt-6 pb-6"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: 'var(--viv-red)' }}
          >
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--viv-navy)' }}>
            {user?.firstName || "Robbin"}
          </span>
        </motion.div>

        <div className="space-y-6">
          {/* Mon empreinte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center py-10"
          >
            <div className="w-full text-left mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--viv-navy)' }}>Mon empreinte</h2>
            </div>
            <div className="text-5xl font-bold mb-2" style={{ color: 'var(--viv-navy)' }}>{displayTotal}</div>
            <div className="text-sm font-medium" style={{ color: '#8892A0' }}>tonnes de CO2 / an</div>
          </motion.div>

          {/* Mes consommations actuelles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--viv-navy)' }}>Mes consommations actuelles</h2>
            <div className="grid grid-cols-2 gap-4">
              {consumptions.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <IconBox icon={item.icon} />
                    <span className="text-sm font-medium hidden sm:inline" style={{ color: 'var(--viv-navy)' }}>{item.name}</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--viv-navy)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Modifier mes consommations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--viv-navy)' }}>Modifier mes consommations</h2>
            <div className="grid grid-cols-2 gap-4">
              {consumptions.map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => handleOpenModal(item)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[var(--viv-secondary)]"
                >
                  <div className="flex items-center gap-3">
                    <IconBox icon={item.icon} />
                    <span className="text-sm font-medium hidden sm:inline" style={{ color: 'var(--viv-navy)' }}>{item.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Mes dernières modifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--viv-navy)' }}>Mes anciennes consommations</h2>
            <div className="grid grid-cols-2 gap-4">
              {recentModifications.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 w-3/4">
                    <IconBox icon={item.icon} />
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium leading-tight truncate hidden sm:block" style={{ color: 'var(--viv-navy)' }}>{item.name}</span>
                      <span className="text-[10px] text-gray-400">{item.date}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--viv-navy)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Modal / Dialog for Modifying consumption */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl relative"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--viv-secondary)]"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold mb-2 pr-8" style={{ color: 'var(--viv-navy)' }}>
              Modifier : {selectedCategory.name}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Mettez à jour votre valeur de consommation actuelle pour cette catégorie.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--viv-navy)' }}>
                Nouvelle valeur (t CO2)
              </label>
              <input 
                type="number"
                step="0.01"
                min="0"
                value={consumptionValue}
                onChange={e => setConsumptionValue(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--viv-secondary)] focus:border-transparent transition-all"
              />
            </div>
            
            <button 
              onClick={handleSaveModification}
              className="w-full py-3 rounded-xl text-white font-medium shadow-md transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--viv-secondary)] focus:ring-offset-2"
              style={{ backgroundColor: 'var(--viv-secondary)' }}
            >
              Enregistrer
            </button>
          </motion.div>
        </div>
      )}

      <Navigation currentPage="dashboard" />
    </div>
  );
}




