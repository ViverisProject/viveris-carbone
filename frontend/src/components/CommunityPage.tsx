import { useState } from "react";
import { Search, Trophy, UserPlus, TreePine, Bell, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Navigation } from "./Navigation";

export function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const friends = [
    { id: 1, name: "Marie Dubois", trees: 5, streak: 15, avatar: "MD" },
    { id: 2, name: "Thomas Martin", trees: 3, streak: 8, avatar: "TM" },
    { id: 3, name: "Sophie Bernard", trees: 4, streak: 12, avatar: "SB" },
    { id: 4, name: "Lucas Petit", trees: 2, streak: 6, avatar: "LP" },
  ];

  const leaderboard = [
    { rank: 1, name: "Jordan Forest", trees: 12, points: 3200, avatar: "JF", percentage: 95 },
    { rank: 2, name: "Alex Rivers", trees: 10, points: 2800, avatar: "AR", percentage: 87 },
    { rank: 3, name: "Julie Ocean", trees: 9, points: 2500, avatar: "JO", percentage: 82 },
    { rank: 4, name: "Ash Leaf", trees: 8, points: 2300, avatar: "AL", percentage: 75 },
    { rank: 5, name: "Skye Rivers", trees: 7, points: 2100, avatar: "SR", percentage: 73 },
    { rank: 6, name: "Jasper Flint", trees: 6, points: 1800, avatar: "JF", percentage: 40 },
    { rank: 7, name: "Luna Blaze", trees: 5, points: 1500, avatar: "LB", percentage: 32 },
    { rank: 8, name: "Kai Field", trees: 4, points: 1240, avatar: "KF", percentage: 30 },
    { rank: 9, name: "Slate Ridge", trees: 3, points: 900, avatar: "SR", percentage: 27 },
  ];

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

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
            Rejoindre la communauté
          </h1>
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center">
            <Bell className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--viv-navy)' }} />
          </button>
        </motion.div>

        <p className="text-sm md:text-base mb-6" style={{ color: 'var(--viv-text-secondary)' }}>
          Connectez-vous avec d'autres personnes engagées dans la réduction de leur empreinte carbone.
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
          {/* Left Column */}
          <div className="space-y-10 lg:col-span-7">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-[20px] focus:outline-none focus:ring-2"
                  style={{
                    border: '1px solid rgba(30, 41, 59, 0.05)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    '--tw-ring-color': 'var(--viv-red)'
                  } as any}
                />
              </div>
            </motion.div>

            {/* Vos amis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-semibold" style={{ color: 'var(--viv-navy)' }}>
                  Vos amis
                </h2>
                <button className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--viv-secondary)' }}>
                  Trouver d'autres amis
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pt-2">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex-shrink-0">
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                      style={{ backgroundColor: 'var(--viv-red)' }}
                    >
                      {friend.avatar}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>


          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6" style={{ color: 'var(--viv-secondary)' }} />
                <h2 className="text-lg md:text-xl font-semibold" style={{ color: 'var(--viv-navy)' }}>Classement</h2>
              </div>

              {/* Podium - Top 3 */}
              <div className="flex items-end justify-center gap-6 mb-10">        
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <div 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white font-semibold border-[6px]"
                      style={{
                        backgroundColor: 'var(--viv-red)',
                        borderColor: '#e5e7eb'
                      }}
                    >
                      {topThree[1].avatar}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm" style={{ backgroundColor: '#e5e7eb', color: 'var(--viv-navy)' }}>
                      🥈
                    </div>
                  </div>
                  <div className="text-xs font-medium text-center" style={{ color: 'var(--viv-navy)' }}>
                    {topThree[1].name.split(' ')[0]}
                  </div>
                  <div className="text-xs" style={{ color: '#64748B' }}>
                    {topThree[1].points} pts
                  </div>
                </div>

                {/* 1st Place (Taller) */}
                <div className="flex flex-col items-center -mt-4">
                  <div className="relative mb-2">
                    <div 
                      className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white font-semibold text-lg border-[6px]"
                      style={{
                        backgroundColor: 'var(--viv-red)',
                        borderColor: '#fbbf24'
                      }}
                    >
                      {topThree[0].avatar}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm" style={{ backgroundColor: '#fbbf24', color: 'white' }}>
                      🏆
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-center" style={{ color: 'var(--viv-navy)' }}>
                    {topThree[0].name.split(' ')[0]}
                  </div>
                  <div className="text-xs" style={{ color: '#64748B' }}>
                    {topThree[0].points} pts
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <div 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white font-semibold border-[6px]"
                      style={{
                        backgroundColor: 'var(--viv-red)',
                        borderColor: '#d97706'
                      }}
                    >
                      {topThree[2].avatar}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm" style={{ backgroundColor: '#d97706', color: 'white' }}>
                      🥉
                    </div>
                  </div>
                  <div className="text-xs font-medium text-center" style={{ color: 'var(--viv-navy)' }}>
                    {topThree[2].name.split(' ')[0]}
                  </div>
                  <div className="text-xs" style={{ color: '#64748B' }}>
                    {topThree[2].points} pts
                  </div>
                </div>
              </div>

              {/* Rest of Leaderboard */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {restOfLeaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center gap-4 p-4 rounded-[20px]"
                    style={{ backgroundColor: '#f8fafc' }}      
                  >
                    <div className="w-8 text-center font-semibold" style={{ color: '#64748B' }}>
                      {user.rank}
                    </div>
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: 'var(--viv-red)' }}
                    >
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium" style={{ color: 'var(--viv-navy)' }}>
                        {user.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: 'var(--viv-secondary)' }}>
                        {user.points} pts
                      </span>
                      <ChevronRight className="w-4 h-4" style={{ color: '#94A3B8' }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Navigation currentPage="community" />
    </div>
  );
}
