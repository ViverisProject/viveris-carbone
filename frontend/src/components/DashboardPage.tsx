import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Home, Target, Users, User, Leaf, Car, UtensilsCrossed, Zap, TrendingDown, ChevronRight, Bell } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { motion } from "motion/react";
import { Navigation } from "./Navigation";

export function DashboardPage() {
  const [user, setUser] = useState<any>(null);

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
    { name: "Mobility", icon: Car, path: "/consumption/mobility" },
    { name: "Food", icon: UtensilsCrossed, path: "/consumption/food" },
    { name: "Energy", icon: Zap, path: "/consumption/energy" },
    { name: "Lifestyle", icon: Leaf, path: "/consumption/lifestyle" },
  ];

  return (
    <div className="min-h-screen pb-32 md:pb-8 md:pl-64 lg:pl-72" style={{ backgroundColor: 'var(--eco-beige)' }}>
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
              style={{ background: 'linear-gradient(to bottom right, var(--eco-green), var(--eco-green-dark))' }}
            >
              {user?.firstName?.charAt(0) || "U"}
              {user?.lastName?.charAt(0) || ""}
            </div>
            <span className="font-bold text-lg md:text-xl" style={{ color: 'var(--eco-navy)' }}>
              {user?.firstName || "Robbin"}
            </span>
          </div>
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center">
            <Bell className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--eco-navy)' }} />
          </button>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Your Footprint Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-semibold" style={{ color: 'var(--eco-navy)' }}>
                  Your Footprint
                </h2>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
                  <span>MON</span>
                  <span>24</span>
                  <span>JULY</span>
                  <Leaf className="w-4 h-4" />
                </div>
              </div>

              <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                Track your daily activities to see how they contribute to your overall CO2 emissions.
              </p>

              {/* Chart */}
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748B' }}
                    />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {weeklyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? '#FB923C' : index === 1 ? '#FB923C' : index === 2 ? '#A3E635' : index === 3 ? '#A3E635' : index === 4 ? '#A3E635' : '#7DD9B3'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Total */}
              <div className="text-center">
                <div className="text-sm mb-1" style={{ color: '#64748B' }}>Total</div>
                <div className="text-4xl md:text-5xl mb-1" style={{ color: 'var(--eco-navy)' }}>4.98</div>
                <div className="text-sm" style={{ color: '#64748B' }}>Tons CO2e</div>
              </div>
            </motion.div>

            {/* Add Your Consumption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--eco-navy)' }}>
                Add Your Consumption
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.name}
                      to={category.path}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white hover:shadow-md transition-all"
                      style={{ border: '1px solid rgba(30, 41, 59, 0.1)' }}
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(125, 217, 179, 0.2)' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: 'var(--eco-green)' }} />
                      </div>
                      <span className="flex-1 font-medium" style={{ color: 'var(--eco-navy)' }}>
                        {category.name}
                      </span>
                      <ChevronRight className="w-5 h-5" style={{ color: '#94A3B8' }} />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div>
            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--eco-navy)' }}>
                Tips
              </h3>
              <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                Here are some personalized tips to reduce your carbon footprint based on your consumption.
              </p>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-3xl shadow-lg p-5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: 'rgba(125, 217, 179, 0.2)' }}
                  >
                    <UtensilsCrossed className="w-6 h-6" style={{ color: 'var(--eco-green)' }} />
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--eco-navy)' }}>
                    Eat Local
                  </h4>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                    Buy locally produced food to reduce transportation emissions.
                  </p>
                  <button 
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'var(--eco-green)' }}
                  >
                    Learn More
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(125, 217, 179, 0.2)' }}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: 'rgba(125, 217, 179, 0.2)' }}
                  >
                    <Car className="w-6 h-6" style={{ color: 'var(--eco-green)' }} />
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--eco-navy)' }}>
                    Use Public Transport
                  </h4>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                    Choose public transport or carpooling to reduce emissions.
                  </p>
                  <button 
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'var(--eco-green)' }}
                  >
                    Learn More
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(125, 217, 179, 0.2)' }}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Navigation currentPage="dashboard" />
    </div>
  );
}