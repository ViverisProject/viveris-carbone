import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Leaf, TrendingDown, Car, UtensilsCrossed, Zap, ShoppingBag, CheckCircle, XCircle } from "lucide-react";
import { motion } from "motion/react";


export function ResultPage() {
  const [result, setResult] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const stored = sessionStorage.getItem("quizResult");
    if (stored) {
      const parsed = JSON.parse(stored);
      setResult(parsed);
    }
    
    const storedPredictions = sessionStorage.getItem("userPredictions");
    if (storedPredictions) {
      setPredictions(JSON.parse(storedPredictions));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--viv-beige)' }}>
        <p style={{ color: 'var(--viv-secondary)' }}>Chargement...</p>
      </div>
    );
  }

  // Calculate breakdown by category
  const categoryTotals: Record<string, number> = {
    Transport: 0,
    Alimentation: 0,
    Énergie: 0,
    Consommation: 0,
  };

  // Mock calculation based on answers
  categoryTotals.Transport = 1.8;
  categoryTotals.Alimentation = 1.2;
  categoryTotals.Énergie = 1.5;
  categoryTotals.Consommation = 0.7;

  const chartData = [
    { name: "Transport", value: categoryTotals.Transport, color: "#ff5046" },
    { name: "Alimentation", value: categoryTotals.Alimentation, color: "#2a31d4" },
    { name: "Énergie", value: categoryTotals.Énergie, color: "#7e83e5" },
    { name: "Consommation", value: categoryTotals.Consommation, color: "#ff958f" },
  ];

  const totalCO2 = result.totalInTons;
  const targetCO2 = 2.3;
  const difference = totalCO2 - targetCO2;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--viv-beige)' }}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
            <img src="/src/Pack_charte_graphique/Logos/Logos_Viveris/Avec%20signature/Viveris%20-%20Logo%20-%20Baseline%20-%20RVB%20-%20Noir.png" alt="Viveris Carbone" className="h-20 md:h-24 object-contain" />
        </div>
      </header>
      <main className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Result Card */}
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-[var(--viv-navy)] mb-6 text-center">
              Votre empreinte carbone actuelle
            </h1>

            <div className="text-center mb-8">
              <div className="inline-block p-8 bg-gradient-to-br bg-white rounded-3xl">
                <div className="text-6xl font-bold text-[var(--viv-navy)]">
                  {totalCO2}
                </div>
                <div className="text-xl text-[var(--viv-navy)] mt-2">
                  tonnes de CO2 / an
                </div>
              </div>
            </div>

            {difference > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-amber-900 font-medium">
                      Vous êtes à {difference.toFixed(1)} tonnes au-dessus de l'objectif 2050
                    </p>
                    <p className="text-amber-700 text-sm mt-1">
                      L'objectif fixé par le Haut Conseil pour le Climat est de {targetCO2} tonnes de CO2 par an d'ici 2050.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 border border-[var(--viv-red-light)] rounded-xl p-4 mb-8">
                <p className="text-[var(--viv-navy)] text-center">
                  Félicitations ! Vous êtes en dessous de l'objectif 2050 de {targetCO2} tonnes de CO2 par an.
                </p>
              </div>
            )}

            {/* Chart Replacement: Sorted List */}
            <div className="mb-8 max-w-lg mx-auto">
              <h3 className="text-xl font-semibold text-[var(--viv-navy)] mb-4 text-center">
                Répartition par domaine
              </h3>
              <div className="space-y-3">
                {chartData
                  .sort((a, b) => b.value - a.value)
                  .map((entry, index) => (
                    <div key={`list-${index}`} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="font-medium text-[var(--viv-navy)]">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-bold" style={{ color: entry.color }}>{((entry.value / totalCO2) * 100).toFixed(0)}%</span>
                        <span className="text-gray-500 w-12 text-right">{entry.value}t</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Prediction Comparison */}
            {predictions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 bg-gradient-to-br from-white to-[var(--viv-beige)]/30 p-6 rounded-2xl border-2 border-[var(--viv-red-lighter)]"
              >
                <h3 className="text-xl font-semibold text-[var(--viv-navy)] mb-4 text-center">
                  📊 Comparaison avec vos prédictions
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Highest Consumption */}
                  <div>
                    <h4 className="font-medium text-[var(--viv-navy)] mb-3 text-center">
                      Vos prédictions de consommation la plus élevée
                    </h4>
                    <div className="space-y-2">
                      {predictions.highestConsumption.map((categoryId: string, index: number) => {
                        const categoryMap: Record<string, string> = {
                          transport: "Transport",
                          food: "Alimentation",
                          energy: "Énergie",
                          consumption: "Consommation",
                        };
                        const categoryName = categoryMap[categoryId];
                        
                        // Get actual ranking
                        const sortedCategories = Object.entries(categoryTotals)
                          .sort(([, a], [, b]) => (b as number) - (a as number))
                          .map(([name]) => name);
                        const actualRank = sortedCategories.indexOf(categoryName) + 1;
                        const isCorrect = actualRank <= 3;
                        
                        return (
                          <div
                            key={categoryId}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              isCorrect ? "bg-[var(--viv-beige)]/40" : "bg-[var(--viv-red-lighter)]/40"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">
                                {index + 1}. {categoryName}
                              </span>
                            </div>
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-[var(--viv-secondary)]" />
                            ) : (
                              <XCircle className="w-5 h-5 text-[var(--viv-red)]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Flexibility */}
                  <div>
                    <h4 className="font-medium text-[var(--viv-navy)] mb-3 text-center">
                      Domaines où vous pouvez changer
                    </h4>
                    <div className="space-y-2">
                      {predictions.flexibility.map((categoryId: string, index: number) => {
                        const categoryMap: Record<string, string> = {
                          transport: "Transport",
                          food: "Alimentation",
                          energy: "Énergie",
                          consumption: "Consommation",
                        };
                        const categoryName = categoryMap[categoryId];
                        
                        return (
                          <div
                            key={categoryId}
                            className="flex items-center justify-between p-3 rounded-lg bg-white border border-[var(--viv-red-lighter)]"
                          >
                            <span className="font-medium text-gray-700">
                              {index + 1}. {categoryName}
                            </span>
                            <span className="text-sm text-[var(--viv-secondary)]">
                              Domaine d'action
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-700 text-center">
                    💡 <span className="font-medium">Le saviez-vous ?</span> Comparer vos prédictions avec les résultats réels 
                    vous aide à mieux comprendre votre impact environnemental et à identifier les opportunités d'amélioration.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Category Breakdown */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br bg-white p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[var(--viv-red)] rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--viv-navy)]">Transport</div>
                    <div className="text-2xl font-bold text-[var(--viv-navy)]">
                      {categoryTotals.Transport}t
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br bg-white p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#2a31d4] rounded-full flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--viv-navy)]">Alimentation</div>
                    <div className="text-2xl font-bold text-[var(--viv-navy)]">
                      {categoryTotals.Alimentation}t
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br bg-white p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#7e83e5] rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--viv-navy)]">Énergie</div>
                    <div className="text-2xl font-bold text-[var(--viv-navy)]">
                      {categoryTotals.Énergie}t
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br bg-white p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#ff958f] rounded-full flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--viv-navy)]">Consommation</div>
                    <div className="text-2xl font-bold text-[var(--viv-navy)]">
                      {categoryTotals.Consommation}t
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            {user ? (
              <div className="flex justify-center mt-8">
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-[var(--viv-red)] text-white rounded-full font-semibold hover:bg-[var(--viv-red-dark)] transition-colors text-center"
                >
                  Retour au tableau de bord
                </Link>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">    
                  <Link
                    to="/signup"
                    className="px-8 py-3 bg-[var(--viv-red)] text-white rounded-full font-semibold hover:bg-[var(--viv-red-dark)] transition-colors text-center"                  >
                    Créer mon compte
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3 bg-white text-[var(--viv-red)] border-2 border-[var(--viv-red)] rounded-full font-semibold hover:bg-white/50 transition-colors text-center"                                                                              >
                    Me connecter
                  </Link>
                </div>
    
                <p className="text-center text-[var(--viv-navy)] text-sm mt-4">     
                  Enregistrez vos données pour suivre vos progrès et accéder aux défis personnalisés
                </p>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

