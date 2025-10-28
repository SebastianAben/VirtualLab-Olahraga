import { useEffect, useRef, useState } from 'react';
import { HeartRateGraph } from './components/HeartRateGraph';
import { Dashboard } from './components/Dashboard';
import { ChallengePanel } from './components/ChallengePanel';
import { AuthButton } from './components/AuthButton';
import { AuthModal } from './components/AuthModal';
import { ProfilePage } from './components/ProfilePage';
import { ChallengeSelection } from './components/ChallengeSelection';
import {
  SimulationState,
  Challenge,
  ExerciseIntensity,
  SimulationResult,
} from './types';
import { InsightModal } from './components/InsightModal';
import { Notification } from './components/Notification';
import * as api from './lib/api';
import { LearningCenter, LearningChapter } from './components/LearningCenter';
import { LearningChapterDetail } from './components/LearningChapterDetail';
import { Sun, Moon } from 'lucide-react';

const learningChapters: LearningChapter[] = [
  {
    id: 'introduction',
    title: 'The Best Ability is Availability',
    summary:
      'Tidak ada kemajuan tanpa konsistensi. Bab pengantar ini menegaskan pentingnya pencegahan cedera sebagai pondasi performa jangka panjang.',
    icon: 'book',
    takeaways: [
      'Pepatah "The best ability is availability" mengingatkan bahwa atlet terbaik adalah mereka yang mampu berlatih tanpa terhambat cedera.',
      'Pencegahan cedera bukan tambahan, melainkan komponen utama program latihan performa.',
      'Panduan ini akan membahas empat pilar utama pembentukan tubuh yang tahan terhadap tuntutan latihan berat.',
    ],
  },
  {
    id: 'pillar-warmup',
    title: 'Dynamic Warm-Up',
    summary:
      'Pemanasan dinamis menyiapkan tubuh seperti gladi resik sebelum tampil. Ia mengaktifkan sendi, otot, dan koneksi saraf secara sistematis. Pemanasan dilakukan untuk mengurangi risiko terjadinya cidera.',
    icon: 'activity',
    takeaways: [
      'Pemanasan yang baik melumasi sendi, meningkatkan aliran darah, dan mengaktifkan koneksi neuromuskular sehingga risiko keseleo dan strain menurun drastis.',
      'Formula 5–10 menit: 2 menit gerak umum (jogging, jumping jacks); 5 menit mobilitas dinamis dan aktivasi (leg swing, cat-cow, windmill, glute bridge, band walk); 3 menit pengenalan gerak spesifik dengan intensitas rendah.',
      'Jadikan pemanasan sebagai ritual wajib sebelum latihan—bukan formalitas yang boleh dilewatkan.',
    ],
  },
  {
    id: 'pillar-cooldown',
    title: 'Cool-Down',
    summary:
      'Cooling down merupakan salah satu aspek penting setelah melakukan olahraga. Manfaatnya antara lain membantu pemulihan sistemik, mempercepat pembuangan metabolit, dan membuka ruang peningkatan fleksibilitas.',
    icon: 'recovery',
    takeaways: [
      'Pendinginan bertahap membantu tubuh kembali ke kondisi istirahat, mengurangi DOMS, dan menjaga tekanan darah tetap stabil.',
      'Formula 5–10 menit: 3–5 menit kardio intensitas rendah (jalan santai/sepeda pelan) lalu 5 menit peregangan statis pada otot utama yang baru bekerja, tahan 30–60 detik sambil bernapas tenang.',
      'Manfaatkan momentum ini untuk refleksi singkat dan reset mental sebelum beralih ke aktivitas lain.',
    ],
  },
  {
    id: 'pillar-pain',
    title: 'Bedakan Good Pain vs Bad Pain',
    summary:
      'Memahami sinyal tubuh adalah kunci. Good pain menandakan adaptasi, sedangkan bad pain adalah tanda berhenti sebelum masalah menjadi kronis.',
    icon: 'brain',
    takeaways: [
      'Good pain: sensasi terbakar di perut otot saat set berat dan nyeri tumpul 24–48 jam setelah latihan (DOMS) menandakan stimulus adaptif.',
      'Bad pain: rasa tajam, menusuk, terlokalisir di sendi/tendon/tulang, meningkat saat dipaksa, atau disertai bunyi “pop”; segera hentikan latihan.',
      'Mengabaikan bad pain mengubah gangguan kecil menjadi cedera kronis—jadikan rasa sakit sebagai data, bukan musuh.',
    ],
  },
  {
    id: 'pillar-prehab',
    title: 'Mindset Prehab',
    summary:
      'Prehab berarti memperkuat mata rantai lemah sebelum putus. Fokus pada otot penstabil kecil di pinggul, core, dan bahu untuk membangun tubuh anti-cedera.',
    icon: 'target',
    takeaways: [
      'Prehab adalah praktik proaktif mengidentifikasi dan memperkuat titik lemah, terutama otot penstabil yang jarang dilatih.',
      'Analisis biomekanik aplikasi membantu mendeteksi pola risiko—misal knee valgus pada squat—dan merekomendasikan latihan spesifik seperti banded lateral walk atau single-leg glute bridge.',
      'Integrasikan sesi prehab pendek secara rutin untuk menjaga kualitas gerak dan mencegah regresi teknik.',
    ],
  },
];

type AppView = 'challengeSelection' | 'lab' | 'profile' | 'learning' | 'learningDetail';

function App() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [user, setUser] = useState<{ email: string; token: string } | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('challengeSelection');
  const [userResults, setUserResults] = useState<SimulationResult[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [insightModalOpen, setInsightModalOpen] = useState(false);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [isChallengeRunning, setIsChallengeRunning] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  const lastUpdateRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      setUser({ email, token });
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadUserResults();
      const startSim = async () => {
        try {
          const { simulationId, initialState } = await api.startSimulation(user.token);
          setSimulationId(simulationId);
          setState(initialState);
        } catch (error) {
          console.error(error);
        }
      };
      startSim();
    }
  }, [user]);

  const loadUserResults = async () => {
    if (!user) return;
    try {
      const results = await api.getResults(user.token);
      setUserResults(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const gameLoop = async () => {
      if (!simulationId || !user) return;

      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      try {
        const newState = await api.updateSimulation(user.token, simulationId, undefined, deltaTime);
        setState(newState);

        if (isChallengeRunning && challenge && !challenge.completed) {
          setChallenge((prev) => {
            if (!prev) return null;
            const newElapsedTime = prev.elapsedTime + deltaTime / 1000;
            const newTimeInZone =
              newState.zone === prev.targetZone
                ? prev.timeInZone + deltaTime / 1000
                : prev.timeInZone;

            if (newElapsedTime >= prev.totalDuration) {
              setIsChallengeRunning(false);
              const grade = newState.grade || 'F';
              return {
                ...prev,
                elapsedTime: prev.totalDuration,
                timeInZone: newTimeInZone,
                completed: true,
                grade,
              };
            }

            return {
              ...prev,
              elapsedTime: newElapsedTime,
              timeInZone: newTimeInZone,
            };
          });
        }
      } catch (error) {
        console.error(error);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [simulationId, user, isChallengeRunning, challenge]);

  const handleIntensityChange = async (intensity: ExerciseIntensity) => {
    if (!simulationId || !user) return;
    try {
      const newState = await api.updateSimulation(user.token, simulationId, intensity, 0);
      setState(newState);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChallengeStart = () => {
    if (challenge && !challenge.completed) {
      setIsChallengeRunning(true);
    }
  };

  const handleChallengeReset = () => {
    setIsChallengeRunning(false);
    setChallenge((prev) => (prev ? { ...prev, elapsedTime: 0, timeInZone: 0, completed: false, grade: null } : null));
  };

  const handleChallengeSelect = async (selectedChallenge: Omit<Challenge, 'elapsedTime' | 'timeInZone' | 'completed' | 'grade'>) => {
    if (!user || !simulationId) return;
    try {
      const updatedState = await api.setChallenge(user.token, simulationId, selectedChallenge);
      setState(updatedState);
      setChallenge({
        ...selectedChallenge,
        elapsedTime: 0,
        timeInZone: 0,
        completed: false,
        grade: null,
      });
      setCurrentView('lab');
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackToSelection = () => {
    setChallenge(null);
    setIsChallengeRunning(false);
    setCurrentView('challengeSelection');
  };

  const navigateToVirtualLab = () => {
    setCurrentView(challenge ? 'lab' : 'challengeSelection');
  };

  const navigateToLearningCenter = () => {
    setSelectedChapterId(null);
    setCurrentView('learning');
  };

  const handleOpenChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setCurrentView('learningDetail');
  };

  const handleBackFromChapter = () => {
    setCurrentView('learning');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isVirtualLabView = currentView === 'challengeSelection' || currentView === 'lab';
  const isLearningView = currentView === 'learning' || currentView === 'learningDetail';
  const isDarkMode = theme === 'dark';
  const selectedChapter = selectedChapterId ? learningChapters.find((chapter) => chapter.id === selectedChapterId) : null;

  const handleAuth = async (email: string, password: string, isSignUp: boolean) => {
    try {
      const { token } = isSignUp ? await api.signUp(email, password) : await api.signIn(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      setUser({ email, token });
    } catch (error) {
      console.error(error);
      setNotification({ message: error.message, type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
    setChallenge(null);
    setState(null);
    setSimulationId(null);
    setIsChallengeRunning(false);
    setSelectedChapterId(null);
    setCurrentView('challengeSelection');
  };

  const handleSaveResult = async () => {
    if (!user || !challenge || !challenge.completed || !challenge.grade) return;

    const result = {
      challenge: challenge.name,
      timeAchieved: challenge.timeInZone,
      grade: challenge.grade,
    };

    try {
      await api.saveResult(user.token, result);
      await loadUserResults();
      setNotification({ message: 'Result saved successfully!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to save result. Please try again.', type: 'error' });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 flex items-center justify-center transition-colors">
        <AuthModal isOpen={true} onClose={() => {}} onSubmit={handleAuth} />
      </div>
    );
  }

  if (currentView === 'profile') {
    return (
      <ProfilePage
        userEmail={user.email || 'Unknown'}
        results={userResults}
        onBack={() => setCurrentView(challenge ? 'lab' : 'challengeSelection')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 dark:text-slate-100 transition-colors duration-300">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <header className="bg-white shadow-md dark:bg-slate-900 dark:shadow-none border-b border-transparent dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center md:gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Virtual Lab</h1>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Interactive Cardiovascular Exercise Simulation
              </p>
            </div>
            <nav className="flex items-center gap-3 mt-2 md:mt-0">
              <button
                onClick={navigateToVirtualLab}
                className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                  isVirtualLabView
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md dark:bg-blue-600 dark:border-blue-500'
                    : 'text-gray-600 border-transparent hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-blue-300'
                }`}
              >
                Virtual Lab
              </button>
              <button
                onClick={navigateToLearningCenter}
                className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                  isLearningView
                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-md dark:bg-indigo-600 dark:border-indigo-500'
                    : 'text-gray-600 border-transparent hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-indigo-300'
                }`}
              >
                Learning Center
              </button>
            </nav>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
                isDarkMode
                  ? 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700'
                  : 'text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <AuthButton
              isAuthenticated={!!user}
              userEmail={user?.email}
              onLogin={() => {}}
              onLogout={handleLogout}
              onViewProfile={() => setCurrentView('profile')}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 transition-colors">
        {currentView === 'learning' && (
          <LearningCenter chapters={learningChapters} onSelectChapter={handleOpenChapter} />
        )}

        {currentView === 'learningDetail' && selectedChapter && (
          <LearningChapterDetail chapter={selectedChapter} onBack={handleBackFromChapter} />
        )}

        {currentView === 'learningDetail' && !selectedChapter && (
          <div className="text-center text-gray-600 dark:text-slate-300 py-16">
            Materi tidak ditemukan. <button className="text-indigo-500 font-semibold" onClick={handleBackFromChapter}>Kembali</button>
          </div>
        )}

        {!isLearningView && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {state && <HeartRateGraph history={state.history} currentZone={state.zone} />}
              {currentView === 'challengeSelection' && (
                <ChallengeSelection onSelectChallenge={handleChallengeSelect} />
              )}
              {currentView === 'lab' && challenge && (
                <ChallengePanel
                  challenge={challenge}
                  onStart={handleChallengeStart}
                  onReset={handleChallengeReset}
                  onSaveResult={handleSaveResult}
                  isAuthenticated={!!user}
                  onViewInsights={() => setInsightModalOpen(true)}
                  onBackToSelection={handleBackToSelection}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              {state && (
                <Dashboard
                  currentHeartRate={state.currentHeartRate}
                  zone={state.zone}
                  intensity={state.intensity}
                  onIntensityChange={handleIntensityChange}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {insightModalOpen && challenge && challenge.grade && (
        <InsightModal grade={challenge.grade} onClose={() => setInsightModalOpen(false)} />
      )}
    </div>
  );
}

export default App;
