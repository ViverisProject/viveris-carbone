import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Leaf, TrendingDown, Car, UtensilsCrossed, Zap, ShoppingBag, CheckCircle, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export function ResultPage() {
  const [result, setResult] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);

  useEffect(() => {
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--eco-beige)' }}>
        <p style={{ color: 'var(--eco-green)' }}>Chargement...</p>
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
    { name: "Transport", value: categoryTotals.Transport, color: "#10b981" },
    { name: "Alimentation", value: categoryTotals.Alimentation, color: "#34d399" },
    { name: "Énergie", value: categoryTotals.Énergie, color: "#6ee7b7" },
    { name: "Consommation", value: categoryTotals.Consommation, color: "#a7f3d0" },
  ];

  const totalCO2 = result.totalInTons;
  const targetCO2 = 2.3;
  const difference = totalCO2 - targetCO2;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--eco-beige)' }}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8" style={{ color: 'var(--eco-green)' }} />
          <span className="text-2xl font-bold" style={{ color: 'var(--eco-navy)' }}>EcoTrack</span>
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
            <h1 className="text-3xl font-bold text-emerald-900 mb-6 text-center">
              Votre empreinte carbone actuelle
            </h1>

            <div className="text-center mb-8">
              <div className="inline-block p-8 bg-gradient-to-br from-emerald-100 to-green-100 rounded-3xl">
                <div className="text-6xl font-bold text-emerald-900">
                  {totalCO2}
                </div>
                <div className="text-xl text-emerald-700 mt-2">
                  tonnes de CO₂ / an
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
                      L'objectif fixé par le Haut Conseil pour le Climat est de {targetCO2} tonnes de CO₂ par an d'ici 2050.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8">
                <p className="text-emerald-900 text-center">
                  Félicitations ! Vous êtes en dessous de l'objectif 2050 de {targetCO2} tonnes de CO₂ par an.
                </p>
              </div>
            )}

            {/* Chart */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-emerald-900 mb-4 text-center">
                Répartition par domaine
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Prediction Comparison */}
            {predictions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200"
              >
                <h3 className="text-xl font-semibold text-emerald-900 mb-4 text-center">
                  📊 Comparaison avec vos prédictions
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Highest Consumption */}
                  <div>
                    <h4 className="font-medium text-emerald-800 mb-3 text-center">
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
                              isCorrect ? "bg-green-100" : "bg-orange-100"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">
                                {index + 1}. {categoryName}
                              </span>
                            </div>
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-orange-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Flexibility */}
                  <div>
                    <h4 className="font-medium text-emerald-800 mb-3 text-center">
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
                            className="flex items-center justify-between p-3 rounded-lg bg-blue-100"
                          >
                            <span className="font-medium text-gray-700">
                              {index + 1}. {categoryName}
                            </span>
                            <span className="text-sm text-blue-700">
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
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">Transport</div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {categoryTotals.Transport}t
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">Alimentation</div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {categoryTotals.Alimentation}t
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">Énergie</div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {categoryTotals.Énergie}t
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">Consommation</div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {categoryTotals.Consommation}t
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors text-center"
              >
                Créer mon compte
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition-colors text-center"
              >
                Me connecter
              </Link>
            </div>

            <p className="text-center text-emerald-700 text-sm mt-4">
              Enregistrez vos données pour suivre vos progrès et accéder aux défis personnalisés
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}