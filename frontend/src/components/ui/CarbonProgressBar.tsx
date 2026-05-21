import { motion } from "motion/react";

interface CarbonProgressBarProps {
  current: number;
  target?: number;
}

export function CarbonProgressBar({ current, target = 2.3 }: CarbonProgressBarProps) {
  // Calcul du pourcentage : indique "à quel point on est proche" de l'objectif
  // Si on émet 4.6t et l'objectif est 2.3t, la barre est remplie à 50%
  const fillPercentage = current <= target ? 100 : (target / current) * 100;
  const isOver = current > target;

  return (
    <div className="w-full max-w-lg mx-auto pt-6 pb-2">
      {/* En-tête de la jauge */}
      <div className="flex justify-between items-end mb-3 px-1">
        <span className="text-sm font-medium text-[var(--viv-navy)]">
          Avancement
        </span>
        <div className="flex items-baseline gap-1 text-[var(--viv-navy)]">
          <span className="font-bold text-xl leading-none">
            {Math.round(fillPercentage)}
          </span>
          <span className="text-sm font-bold">%</span>
        </div>
      </div>

      {/* Track de la jauge */}
      <div className="relative h-4 w-full bg-gray-100 rounded-full mb-5 overflow-hidden">
        {/* Barre de remplissage unie dans les couleurs du thème */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${fillPercentage}%` }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.25 }}
          className="h-full rounded-full relative bg-[var(--viv-secondary)]"
        />
      </div>
      
      {/* Messages d'information (dans une bulle discrète) */}
      <div className="flex justify-center">
        <div className="text-sm font-medium bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm inline-flex items-center gap-2">
          {isOver ? (
            <span className="text-slate-500">
              Écart avec l'objectif 2050 : <span className="font-bold text-[var(--viv-navy)]">+{(current - target).toFixed(1)}t</span>
            </span>
          ) : (
            <span className="text-[var(--viv-secondary)] font-bold">
              Objectif 2050 atteint ! 🎉
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
