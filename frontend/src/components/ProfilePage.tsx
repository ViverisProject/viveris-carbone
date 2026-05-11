import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Trash2, LogOut, TreePine, Award, Flame, Bell, ChevronRight, Settings } from "lucide-react";
import { motion } from "motion/react";
import { Navigation } from "./Navigation";

export function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleDeleteAccount = () => {
    if (confirm("êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const stats = {
    treesPlanted: 2,
    totalPoints: 1240,
    currentStreak: 12,
    bestStreak: 18,
    challengesCompleted: 45,
    co2Reduced: 1.3,
  };

  const achievements = [
    { name: "Premier arbre", icon: "🌱", unlocked: true },
    { name: "7 Jours consécutifs", icon: "🔥", unlocked: true },
    { name: "5 Arbres", icon: "🌳", unlocked: false },
    { name: "30 Jours consécutifs", icon: "⚡", unlocked: false },
  ];

  return (
    <div className="min-h-screen pb-32 md:pb-8 md:pl-64 lg:pl-72" style={{ backgroundColor: 'var(--viv-beige)' }}>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pt-6 pb-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--viv-navy)' }}>
            Profil
          </h1>
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center">
            <Settings className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--viv-navy)' }} />
          </button>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-semibold"
                  style={{ background: 'linear-gradient(to bottom right, var(--viv-red-light), var(--viv-red))' }}
                >
                  {user?.firstName?.charAt(0) || "U"}
                  {user?.lastName?.charAt(0) || ""}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl mb-1" style={{ color: 'var(--viv-navy)' }}>
                    {user?.firstName || "Utilisateur"} {user?.lastName || ""}
                  </h2>
                  <p className="flex items-center gap-2 text-sm md:text-base" style={{ color: '#64748B' }}>
                    <Mail className="w-4 h-4" />
                    {user?.email || "utilisateur@exemple.com"}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-1" style={{ color: 'var(--viv-navy)' }}>
                    {stats.treesPlanted}
                  </div>
                  <div className="text-xs md:text-sm" style={{ color: '#64748B' }}>Arbres</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-1" style={{ color: 'var(--viv-navy)' }}>
                    {stats.totalPoints}
                  </div>
                  <div className="text-xs md:text-sm" style={{ color: '#64748B' }}>Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-1" style={{ color: 'var(--viv-navy)' }}>
                    {stats.currentStreak}
                  </div>
                  <div className="text-xs md:text-sm" style={{ color: '#64748B' }}>Série de jours</div>
                </div>
              </div>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--viv-navy)' }}>
                Statistiques
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white rounded-2xl shadow-md p-4">
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: 'rgba(42, 49, 212, 0.1)' }}
                  >
                    <Award className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--viv-secondary)' }} />
                  </div>
                  <div className="text-2xl md:text-3xl mb-1" style={{ color: 'var(--viv-navy)' }}>
                    {stats.challengesCompleted}
                  </div>
                  <div className="text-sm" style={{ color: '#64748B' }}>Défis terminés</div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-4">
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)' }}
                  >
                    <Flame className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                  </div>
                  <div className="text-2xl md:text-3xl mb-1" style={{ color: 'var(--viv-navy)' }}>
                    {stats.bestStreak}
                  </div>
                  <div className="text-sm" style={{ color: '#64748B' }}>Meilleure série</div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-4 col-span-2">
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: 'rgba(42, 49, 212, 0.1)' }}
                  >
                    <TreePine className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--viv-secondary)' }} />
                  </div>
                  <div className="text-2xl md:text-3xl mb-1" style={{ color: 'var(--viv-navy)' }}>
                    {stats.co2Reduced}t
                  </div>
                  <div className="text-sm" style={{ color: '#64748B' }}>CO2 réduit cette année</div>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--viv-navy)' }}>
                Succès
              </h3>

              <div className="grid grid-cols-4 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl shadow-md p-4 text-center ${
                      !achievement.unlocked ? "opacity-40" : ""
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="text-xs" style={{ color: 'var(--viv-navy)' }}>
                      {achievement.name}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div>
            {/* Paramètres du compte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--viv-navy)' }}>
                Paramètres du compte
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => alert("Fonctionnalitéà venir")}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:shadow-md transition-all text-left"
                  style={{ backgroundColor: 'rgba(42, 49, 212, 0.1)' }}
                >
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--viv-secondary)' }}
                  >
                    <Lock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium md:text-lg" style={{ color: 'var(--viv-navy)' }}>
                      Changer le mot de passe
                    </div>
                    <div className="text-sm" style={{ color: '#64748B' }}>
                      Mettre à jour votre sécurité
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: '#94A3B8' }} />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:shadow-md transition-all text-left bg-blue-50"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <LogOut className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium md:text-lg text-blue-900">
                      Se déconnecter
                    </div>
                    <div className="text-sm text-blue-700">
                      Fermer la session
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: '#3B82F6' }} />
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:shadow-md transition-all text-left bg-red-50"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <Trash2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium md:text-lg text-red-900">
                      Supprimer le compte
                    </div>
                    <div className="text-sm text-red-700">
                      Cette action est irréversible
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: '#EF4444' }} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Navigation currentPage="profile" />
    </div>
  );
}
