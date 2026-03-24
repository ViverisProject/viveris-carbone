import { Link } from "react-router";
import { Home, Target, Users, User, Plus } from "lucide-react";
import { useState } from "react";
import { CreateChallengeModal } from "./CreateChallengeModal";

interface NavigationProps {
  currentPage: string;
}

export function Navigation({ currentPage }: NavigationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const links = [
    { to: "/dashboard", icon: Home, label: "Home", id: "dashboard" },
    { to: "/challenges", icon: Target, label: "Challenges", id: "challenges" },
    { to: "/community", icon: Users, label: "Community", id: "community" },
    { to: "/profile", icon: User, label: "Profile", id: "profile" },
  ];

  const handleCreateChallenge = (challenge: { title: string; category: string; points: number }) => {
    console.log("New challenge created:", challenge);
    // You can add logic here to save the challenge to localStorage or state management
    alert(`Challenge créé: ${challenge.title} (${challenge.category}, ${challenge.points} points)`);
  };

  return (
    <>
      {/* Mobile Navigation (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 max-w-md">
          {/* Navigation bar with rounded top corners */}
          <div 
            className="relative backdrop-blur-lg rounded-t-3xl shadow-2xl"
            style={{ 
              backgroundColor: 'var(--eco-navy)',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            {/* FAB Button */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: 'var(--eco-green)' }}
              >
                <Plus className="w-8 h-8 text-white" />
              </button>
            </div>

            <div className="flex justify-around items-center h-20 pt-2">
              {links.slice(0, 2).map((link) => {
                const Icon = link.icon;
                const isActive = currentPage === link.id;
                return (
                  <Link
                    key={link.id}
                    to={link.to}
                    className="flex flex-col items-center justify-center gap-1 transition-colors min-w-[60px]"
                    style={{
                      color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{link.label}</span>
                  </Link>
                );
              })}
              
              {/* Spacer for FAB */}
              <div className="w-16"></div>
              
              {links.slice(2, 4).map((link) => {
                const Icon = link.icon;
                const isActive = currentPage === link.id;
                return (
                  <Link
                    key={link.id}
                    to={link.to}
                    className="flex flex-col items-center justify-center gap-1 transition-colors min-w-[60px]"
                    style={{
                      color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Navigation (Sidebar) */}
      <nav className="hidden md:block fixed left-0 top-0 bottom-0 w-64 lg:w-72 z-40">
        <div 
          className="h-full flex flex-col p-6 shadow-xl"
          style={{ backgroundColor: 'var(--eco-navy)' }}
        >
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">EcoTrack</h1>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Track your carbon footprint
            </p>
          </div>

          {/* Create Challenge Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 rounded-2xl text-white font-semibold transition-all hover:shadow-lg mb-6 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--eco-green)' }}
          >
            <Plus className="w-5 h-5" />
            New Challenge
          </button>

          {/* Navigation Links */}
          <div className="flex-1 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <Link
                  key={link.id}
                  to={link.to}
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all"
                  style={{
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-base font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <p className="text-xs text-center" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              © 2024 Viveris - EcoTrack
            </p>
          </div>
        </div>
      </nav>

      {/* Create Challenge Modal */}
      <CreateChallengeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateChallenge}
      />
    </>
  );
}