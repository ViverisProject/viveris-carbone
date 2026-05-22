import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { quizApi, type QuizQuestion, type QuizOption } from "../api";
import viverisLogo from "../Pack_charte_graphique/Logos/Logos_Viveris/Avec signature/Viveris - Logo - Baseline - RVB - Noir.png";

export type { QuizQuestion };

function isCustomOption(opt: QuizOption): boolean {
  return opt.min_value === -1;
}

export function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizOption>>({});
  // Tracks raw numeric input for each question's "Autre valeur" option
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const customInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    quizApi
      .getQuestions()
      .then((data) => {
        setQuestions(data);
        sessionStorage.setItem("quizQuestions", JSON.stringify(data));
      })
      .catch((err: any) => {
        const cached = sessionStorage.getItem("quizQuestions");
        if (cached) {
          setQuestions(JSON.parse(cached));
          toast.warning("Chargement hors-ligne des questions.");
        } else {
          toast.error(err.message ?? "Impossible de charger les questions.");
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Focus the input automatically when the user picks "Autre valeur"
  useEffect(() => {
    const q = questions[currentQuestion];
    if (q && answers[q.id] && isCustomOption(answers[q.id])) {
      customInputRef.current?.focus();
    }
  }, [answers, currentQuestion, questions]);

  const handleOptionClick = (option: QuizOption) => {
    const q = questions[currentQuestion];
    if (isCustomOption(option)) {
      // Select "Autre" but keep any existing custom input value
      const rawValue = customValues[q.id] ?? "";
      const numValue = parseFloat(rawValue);
      const resolvedOption: QuizOption = {
        ...option,
        value: isNaN(numValue) ? 0 : numValue,
        // co2 field here is the per-unit rate; multiply by the entered value
        co2: isNaN(numValue) ? 0 : numValue * option.co2,
      };
      setAnswers({ ...answers, [q.id]: resolvedOption });
    } else {
      setAnswers({ ...answers, [q.id]: option });
    }
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = questions[currentQuestion];
    const raw = e.target.value;
    setCustomValues({ ...customValues, [q.id]: raw });

    const numValue = parseFloat(raw);
    const customOpt = q.options.find(isCustomOption);
    if (!customOpt) return;

    // Update the stored answer with the new CO2 calculation
    const resolvedOption: QuizOption = {
      ...customOpt,
      value: isNaN(numValue) ? 0 : numValue,
      co2: isNaN(numValue) ? 0 : numValue * customOpt.co2,
    };
    setAnswers({ ...answers, [q.id]: resolvedOption });
  };

  const handleNext = () => {
    const q = questions[currentQuestion];
    const answer = answers[q.id];

    // If "Autre" is selected, require a positive number
    if (answer && isCustomOption(answer)) {
      const raw = customValues[q.id] ?? "";
      if (!raw || isNaN(parseFloat(raw)) || parseFloat(raw) < 0) {
        toast.error("Veuillez entrer une valeur numérique valide.");
        return;
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalCO2 = Object.values(answers).reduce(
        (sum, ans) => sum + (ans.co2 || 0),
        0
      );
      const totalInTons = (totalCO2 / 1000).toFixed(1);
      sessionStorage.setItem("quizResult", JSON.stringify({ totalInTons, answers }));
      navigate("/prediction");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--viv-beige)" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 rounded-full"
          style={{ borderColor: "var(--viv-secondary)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--viv-beige)" }}>
        <p className="text-lg" style={{ color: "var(--viv-navy)" }}>Aucune question disponible.</p>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ.id];
  const isCustomSelected = selectedAnswer ? isCustomOption(selectedAnswer) : false;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--viv-beige)" }}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <img src={viverisLogo} alt="Viveris Carbone" className="h-20 md:h-24 object-contain" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--viv-red-light)", opacity: 0.3 }}>
            <motion.div
              className="h-full"
              style={{ backgroundColor: "var(--viv-secondary)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm mt-2 text-center" style={{ color: "#64748B" }}>
            Question {currentQuestion + 1} sur {questions.length}
          </p>
        </div>
      </div>

      {/* Question */}
      <main className="container mx-auto px-4 pb-20">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8">
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: "var(--viv-red-light)", color: "var(--viv-navy)", opacity: 0.8 }}
            >
              {currentQ.category}
            </div>

            <h2 className="text-2xl mb-8" style={{ color: "var(--viv-navy)" }}>
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const custom = isCustomOption(option);
                const isSelected = selectedAnswer?.label === option.label;

                return (
                  <div key={index}>
                    <button
                      onClick={() => handleOptionClick(option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        isSelected ? "shadow-lg" : "bg-white hover:shadow-md"
                      }`}
                      style={{
                        borderColor: isSelected ? "var(--viv-red)" : "#E2E8F0",
                        backgroundColor: isSelected ? "var(--viv-red-light)" : "white",
                      }}
                    >
                      {custom && (
                        <Pencil className="w-4 h-4 flex-shrink-0" style={{ color: isSelected ? "var(--viv-red)" : "#94A3B8" }} />
                      )}
                      <span style={{ color: "var(--viv-navy)" }}>{option.label}</span>
                    </button>

                    {/* Inline numeric input shown only when this "Autre" option is selected */}
                    <AnimatePresence>
                      {custom && isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 ml-2 flex items-center gap-3">
                            <input
                              ref={customInputRef}
                              type="number"
                              min="0"
                              step="any"
                              value={customValues[currentQ.id] ?? ""}
                              onChange={handleCustomInput}
                              placeholder="Entrez votre valeur…"
                              className="flex-1 px-4 py-2 rounded-lg border-2 text-sm outline-none transition-colors"
                              style={{
                                borderColor: "var(--viv-red)",
                                color: "var(--viv-navy)",
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ color: "var(--viv-secondary)" }}
            >
              <ArrowLeft className="w-5 h-5" />
              Précédent
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedAnswer || (isCustomSelected && !customValues[currentQ.id])}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: selectedAnswer ? "var(--viv-red)" : "#CBD5E1" }}
            >
              {currentQuestion === questions.length - 1 ? "Voir le résultat" : "Suivant"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
