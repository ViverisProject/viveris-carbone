import { Link } from "react-router";
import { Leaf } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="text-center">
        <Leaf className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-emerald-900 mb-2">404</h1>
        <p className="text-emerald-700 mb-6">Page non trouvée</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
