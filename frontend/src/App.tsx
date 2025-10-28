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
    title: 'Apa Itu Kebugaran Jasmani?',
    summary:
      'Kebugaran jasmani adalah suatu kebutuhan yang harus kita penuhi agar tubuh kita dapat melakukan banyak aktivitas dengan baik. Kebugaran jasmani dapat dikatakan sebagai bentuk kemampuan fisik seseorang untuk melakukan kegiatan sehari-hari tanpa merasa kelelahan yang berlebihan dan tentunya masih memiliki cadangan energi.',
    icon: 'book',
    takeaways: [
      'Semakin baik kebugaran jasmani seseorang maka akan semakin baik juga kemampuannya dalam mengatasi aktivitas sehari-hari.',
      'Perbaikilah pola hidupmu dengan perbanyak kegiatan fisik dan olahraga untuk menjaga ketahanan tubuh.',
      'Ada beberapa unsur dalam menunjang kebugaran jasmani pada tubuh seperti, kekuatan, daya tahan, kelincahan, kecepatan, keseimbangan, dan sebagainya.',
    ],
    detailedContent: [
      'Semakin baik kebugaran jasmani seseorang maka akan semakin baik juga kemampuannya dalam mengatasi aktivitas sehari-hari. Bisa dikatakan bahwa kebugaran jasmani salah satu faktor penentu kesehatan dan ketahanan tubuh. Misalnya dengan banyak berolahraga maka tubuh akan lebih fit dan terhindar dari berbagai penyakit.Semakin baik kebugaran jasmani seseorang maka akan semakin baik juga kemampuannya dalam mengatasi aktivitas sehari-hari. Bisa dikatakan bahwa kebugaran jasmani salah satu faktor penentu kesehatan dan ketahanan tubuh. Misalnya dengan banyak berolahraga maka tubuh akan lebih fit dan terhindar dari berbagai penyakit.',
      'Oleh karena itu perbaikilah pola hidupmu dengan perbanyak kegiatan fisik dan olahraga untuk menjaga ketahanan tubuh. Jangan biarkan tubuh hanya terdiam dan tidak banyak pergerakan, hal tersebut akan memicu kakunya otot dan tulang karena lama tidak diberi kegiatan yang berat.',
      'Daya tahan adalah salah satu unsur kebugaran jasmani yang akan dibahas kali ini. Daya tahan adalah suatu keadaan di mana seseorang dapat menggerakkan tubuh untuk melakukan beberapa aktivitas dengan tempo yang berbeda, namun dapat melakukannya dengan efisien dan efektif tanpa merasakan lelah yang berlebihan. Daya tahan dapat dibagi menjadi dua yaitu, muscular endurance dan cardiorespiratory endurance. Muscular endurance adalah daya tahan dengan menunjukkan kemampuan otot dalam melakukan pekerjaan berat dalam waktu yang lama. Sedangkan cardiorespiratory endurance adalah kemampuan seluruhh tubuh untuk terus bergerak dengan tempo sedang dalam waktu yang lama. ',
    ],
  },
  {
    id: 'pillar-warmup',
    title: 'Detak Jantung Saat Berolahraga',
    summary:
      'Detak jantung normal dapat berubah-ubah sesuai aktivitas. Saat berolahraga, jantung akan berdetak lebih cepat seiring gerakan tubuh yang makin intens.',
    icon: 'activity',
    takeaways: [
      'Detak jantung manusia umumnya bervariasi berdasarkan usia.',
      'Detak jantung dapat diukur menggunakan berbagia cara. Mulai dari monitor jantung di pusat kebugaran, smartwatch serta gawai lain yang mendukung, atau melalui perhitungan manual.',
      'Mengenali dengan baik detak jantung normal saat berolahraga bisa membantu Anda dalam memperkirakan porsi dan jenis olahraga yang tepat.',
    ],
    detailedContent: [
      'Setiap orang memiliki batas detak jantung yang berbeda-beda sesuai dengan rentang usia masing-masing. Batas umur ini dapat dijadikan sebuah acuan untuk menentukan porsi olahraga yang sesuai dengan diri kita. ',
      'Semakin tinggi intensitas olahraga yang kita lakukan maka semakin tinggi juga detak jantung kita. Penting bagi kita untuk terus memonitor detak jantung kita agar terhindar dari cidera yang tidka diinginkan. ',
      'Jika memaksakan diri terlalu keras untuk berolahraga, Anda akan mengalami sesak napas, nyeri di beberapa bagian tubuh, atau sulit mengikuti maupun melakukan gerakan olahraga tersebut. Saat berada pada tingkat ini, kurangi intensitas olahraga secara bertahap. Jika Anda baru saja mulai berolahraga, mulailah dengan gerakan ringan agar tubuh tidak kaget. Setelah itu, tingkatkan intensitas latihan secara bertahap sesuai dengan kemampuan dan kondisi tubuh. Selain itu, perhatikan juga frekuensi olahraga untuk kebugaran jantung, agar manfaat yang diperoleh bisa maksimal dan risiko cedera bisa diminimalkan.',
    ],
  },
  {
    id: 'pillar-cooldown',
    title: 'Pemanasan',
    summary:
      'Pemanasan merupakan tahap mempersiapkan tubuh untuk menghadapi aktivitas fisik yang berat contohnya berolahraga. Pada fase ini tubuh akan melakukan transisi dari keadaan istirahat ke kondisi siap.',
    icon: 'recovery',
    takeaways: [
      'Pemanasan penting dilakukan untuk mengoptimalkan performa dan memperkecil risiko cedera.',
      'Sebelum berolahraga sangat dianjurkan untuk melakukan pemanasan (warming up)',
      'Pemanasan harus dilakukan dengan serius untuk memperkecil risiko cedera.',
    ],
    detailedContent: [
      'Olahraga merupakan kegiatan yang berisiko cedera apabila tidak dilakukan dengan baik. Untuk itu, aktivitas ini membutuhkan persiapan yang tepat guna mengurangi risiko tersebut. Sebelum berolahraga sangat dianjurkan untuk melakukan pemanasan (warming up). Namun, pemanasan sendiri tak jarang dilakukan dengan cara yang kurang tepat. Cukup banyak yang menyebut pemanasan adalah peregangan tanpa memahami peregangan seperti apa yang sebenarnya harus dilakukan. Artikel berikut ini akan menjelaskannya untuk Anda.',
      'Pemanasan merupakan tahap mempersiapkan tubuh untuk menghadapi aktivitas fisik yang berat contohnya berolahraga. Pada fase ini tubuh akan melakukan transisi dari keadaan istirahat ke kondisi siap. Pemanasan penting dilakukan untuk mengoptimalkan performa dan memperkecil risiko cedera. Efek umum dari melakukan pemanasan adalah detak jantung, sirkulasi darah dan suhu tubuh akan meningkat secara perlahan. Aktivitas ini biasanya dilakukan 5-10 menit sebelum latihan inti dimulai, atau sesuai kebutuhan.',
      'Peregangan (streching) adalah aktivitas meregangkan otot rangka untuk mengurangi kekakuan otot atau meningkatkan kelenturan/fleksibilitas otot agar  siap melakukan gerakan-gerakan olahraga yang lebih banyak dan lebih cepat. Peregangan sendiri dapat dibagi kembali menjadi dua jenis yaitu statis dan dinamis.',
    ],
  },
  {
    id: 'pillar-pain',
    title: 'Cooling Down',
    summary:
      'Cooling down adalah gerakan pendinginan yang dilakukan untuk merilekskan otot tubuh dan biasanya dilakukan setelah olahraga sehingga gerakan pendinginan termasuk sebagai aktivitas yang tak boleh dilewatkan.',
    icon: 'brain',
    takeaways: [
      'Gerakan pendinginan umumnya dilakukan secara lambat dan intensitasnya lebih sedikit daripada pemanasan.',
      'Pendinginan dilakukan setelah 3-5 menit melakukan olahraga inti.',
      'Pendinginan merupakan salah satu komponen olahraga yang tidak boleh dilewatkan.',
    ],
    detailedContent: [
      'Gerakan pendinginan atau cooling down adalah suatu aktivitas fisik yang dilakukan setelah olahraga inti untuk membantu merilekskan tubuh. ',
      'Cooling down dilakukan 3-5 menit setelah olahraga inti dan dilakukan dengan gerakan yang lambat dan dengan intensitas lebih sedikit dari pemanasan dan olahraga inti. Ini bertujuan untuk memberi tahu tubuh secara perlahan bahwa olahraga sudah selesai.',
      'Komponen ini seringali disepelekan dan tidak dilakukan oleh banyak orang. Komponen ini sangat penting untuk dilakukan agar terhindar dari cedera yang tak diinginkan.',
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
      throw error;
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
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 flex items-center justify-center transition-colors">
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
        <div className="fixed top-6 inset-x-0 flex justify-center px-4 z-40">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
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
