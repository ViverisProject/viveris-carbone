import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Leaf, Mail, Lock } from "lucide-react";
import { motion } from "motion/react";

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would call an API
    localStorage.setItem("user", JSON.stringify({ firstName: "Utilisateur", email: formData.email }));
    navigate("/dashboard");
  };

  const handleGoogleLogin = () => {
    // Mock Google login
    localStorage.setItem("user", JSON.stringify({ firstName: "Utilisateur", email: "utilisateur@exemple.com" }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--viv-beige)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/src/Pack_charte_graphique/Logos/Logos_Viveris/Avec%20signature/Viveris%20-%20Logo%20-%20Baseline%20-%20RVB%20-%20Noir.png" alt="Viveris Carbone" className="h-12 object-contain" />
          </div>

          <h2 className="text-2xl text-center mb-6" style={{ color: 'var(--viv-navy)' }}>
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--viv-navy)' }}>
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--viv-secondary)' }} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                  style={{ 
                    border: '1px solid rgba(78, 175, 137, 0.3)',
                    '--tw-ring-color': 'var(--viv-red)'
                  } as any}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--viv-navy)' }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--viv-secondary)' }} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                  style={{ 
                    border: '1px solid rgba(78, 175, 137, 0.3)',
                    '--tw-ring-color': 'var(--viv-red)'
                  } as any}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white py-3 rounded-xl font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--viv-secondary)' }}
              
              
            >
              Me connecter
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid rgba(78, 175, 137, 0.3)' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white" style={{ color: '#64748B' }}>Ou</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white py-3 rounded-xl font-semibold transition-colors hover:opacity-90 flex items-center justify-center gap-2"
            style={{ 
              border: '2px solid rgba(78, 175, 137, 0.3)',
              color: 'var(--viv-navy)'
            }}
            
            
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuer avec Google
          </button>

          <p className="text-center text-sm mt-6" style={{ color: '#64748B' }}>
            Vous n'avez pas de compte ?{" "}
            <Link to="/quiz" className="font-semibold" style={{ color: 'var(--viv-secondary)' }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
