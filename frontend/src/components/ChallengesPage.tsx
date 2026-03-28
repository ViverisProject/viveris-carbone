import { useState } from "react";
import { Flame, CheckCircle2, Circle, TreePine, Bell, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Navigation } from "./Navigation";

export function ChallengesPage() {
  const [challenges, setChallenges] = useState([
    { id: 1, title: "0g de viande rouge aujourd'hui", completed: true, points: 50, category: "Alimentation" },
    { id: 2, title: "Utiliser les transports en commun", completed: true, points: 30, category: "Transport" },
    { id: 3, title: "Éteindre les appareils en veille", completed: false, points: 20, category: "Énergie" },
    { id: 4, title: "Acheter local et de saison", completed: false, points: 40, category: "Alimentation" },
    { id: 5, title: "Zéro plastique à usage unique", completed: true, points: 35, category: "Consommation" },
    { id: 6, title: "Réduire la température de 1°C", completed: false, points: 25, category: "Énergie" },
  ]);

  const streak = 12;
  const totalPoints = 1240;
  const treesPlanted = 2;
  const treeProgress = 65;

  const completedToday = challenges.filter((c) => c.completed).length;
  const totalChallenges = challenges.length;

  const toggleChallenge = (id: number) => {
    setChallenges(
      challenges.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  return (
    <div className="min-h-screen pb-32 md:pb-8 md:pl-64 lg:pl-72" style={{ backgroundColor: 'var(--eco-beige)' }}>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pt-6 pb-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--eco-navy)' }}>
            Challenges
          </h1>
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center">
            <Bell className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--eco-navy)' }} />
          </button>
        </motion.div>

        <p className="text-sm md:text-base mb-6" style={{ color: 'var(--eco-text-secondary)' }}>
          Terminez vos défis quotidiens pour développer votre arbre et gagner des points.
        </p>

        {/* Grid Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Streak & Points Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Flame className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
                  </div>
                  <div className="text-3xl md:text-4xl mb-1" style={{ color: 'var(--eco-navy)' }}>{streak}</div>
                  <div className="text-sm md:text-base" style={{ color: '#64748B' }}>Série de jours</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TreePine className="w-8 h-8 md:w-10 md:h-10" style={{ color: 'var(--eco-green)' }} />
                  </div>
                  <div className="text-3xl md:text-4xl mb-1" style={{ color: 'var(--eco-navy)' }}>{totalPoints}</div>
                  <div className="text-sm md:text-base" style={{ color: '#64748B' }}>Points totaux</div>
                </div>
              </div>
            </motion.div>

            {/* Daily Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-lg p-5"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold md:text-lg" style={{ color: 'var(--eco-navy)' }}>Today's Progress</span>
                <span className="font-semibold md:text-lg" style={{ color: 'var(--eco-green)' }}>
                  {completedToday}/{totalChallenges}
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(125, 217, 179, 0.2)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(completedToday / totalChallenges) * 100}%`,
                    backgroundColor: 'var(--eco-green)'
                  }}
                />
              </div>
            </motion.div>

            {/* Challenges List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--eco-navy)' }}>
                Today's Challenges
              </h2>

              <div className="space-y-3">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    onClick={() => toggleChallenge(challenge.id)}
                    className={`bg-white rounded-2xl shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                      challenge.completed ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {challenge.completed ? (
                          <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--eco-green)' }} />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-medium mb-2 ${
                            challenge.completed ? "line-through" : ""
                          }`}
                          style={{ color: challenge.completed ? '#94A3B8' : 'var(--eco-navy)' }}
                        >
                          {challenge.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(125, 217, 179, 0.2)', color: 'var(--eco-navy)' }}>
                            {challenge.category}
                          </span>
                          <span className="font-semibold" style={{ color: 'var(--eco-green)' }}>
                            +{challenge.points} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Tree Progress */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg p-6 sticky top-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1" style={{ color: 'var(--eco-navy)' }}>
                    Your Tree is Growing
                  </h2>
                  <p className="text-sm md:text-base" style={{ color: '#64748B' }}>
                    {treesPlanted} tree{treesPlanted > 1 ? "s" : ""} planted
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl mb-1" style={{ color: 'var(--eco-green)' }}>{treeProgress}%</div>
                  <p className="text-sm" style={{ color: '#64748B' }}>pour le prochain arbre</p>
                </div>
              </div>

              {/* Tree Visualization */}
              <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden mb-4" style={{ background: 'linear-gradient(to bottom, #E0F2FE, #D1FAE5)' }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: treeProgress / 100 }}
                    transition={{ duration: 1 }}
                    className="relative"
                  >
                    <TreePine
                      className="w-28 h-28 md:w-32 md:h-32"
                      style={{ color: 'var(--eco-green)', filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
                    />
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6" style={{ backgroundColor: 'rgba(180, 83, 9, 0.3)' }} />
              </div>

              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(125, 217, 179, 0.2)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: 'var(--eco-green)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${treeProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Navigation currentPage="challenges" />
    </div>
  );
}