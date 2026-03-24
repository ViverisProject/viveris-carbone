import { Link } from "react-router";
import { Leaf, TreePine, Sprout } from "lucide-react";
import { motion } from "motion/react";

export function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--eco-beige)' }}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8" style={{ color: 'var(--eco-green)' }} />
          <span className="text-2xl font-bold" style={{ color: 'var(--eco-navy)' }}>EcoTrack</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center gap-4 mb-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                <TreePine className="w-16 h-16" style={{ color: 'var(--eco-green)' }} />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                <Leaf className="w-16 h-16" style={{ color: 'var(--eco-mint)' }} />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                <Sprout className="w-16 h-16" style={{ color: 'var(--eco-green-dark)' }} />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-6xl mb-6" style={{ color: 'var(--eco-navy)' }}>
              Mesurez et réduisez votre empreinte carbone
            </h1>

            <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: '#64748B' }}>
              Rejoignez le mouvement vers un avenir durable. Calculez votre
              impact environnemental et adoptez des habitudes éco-responsables
              pour atteindre l'objectif de 2,3 tonnes de CO₂ par an d'ici 2050.
            </p>

            <Link
              to="/quiz"
              className="inline-block text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: 'var(--eco-green)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--eco-green-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--eco-green)'}
            >
              Calculer mon empreinte
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-8 mt-20"
          >
            <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-md">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--eco-mint)', opacity: 0.3 }}>
                <Leaf className="w-6 h-6" style={{ color: 'var(--eco-green)' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--eco-navy)' }}>
                Analyse personnalisée
              </h3>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Questionnaire adapté pour calculer votre empreinte carbone actuelle
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-md">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--eco-mint)', opacity: 0.3 }}>
                <TreePine className="w-6 h-6" style={{ color: 'var(--eco-green)' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--eco-navy)' }}>
                Défis et gamification
              </h3>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Plantez des arbres virtuels en atteignant vos objectifs
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-md">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--eco-mint)', opacity: 0.3 }}>
                <Sprout className="w-6 h-6" style={{ color: 'var(--eco-green)' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--eco-navy)' }}>
                Communauté engagée
              </h3>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Comparez vos progrès et motivez-vous avec d'autres utilisateurs
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}