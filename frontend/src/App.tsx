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

type AppView = 'challengeSelection' | 'lab' | 'profile';

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

  const [isChallengeRunning, setIsChallengeRunning] = useState(false);

  const lastUpdateRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Virtual Lab
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Interactive Cardiovascular Exercise Simulation
            </p>
          </div>
          <AuthButton
            isAuthenticated={!!user}
            userEmail={user?.email}
            onLogin={() => {}}
            onLogout={handleLogout}
            onViewProfile={() => setCurrentView('profile')}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {state && <HeartRateGraph history={state.history} currentZone={state.zone} />}
            {currentView === 'challengeSelection' && <ChallengeSelection onSelectChallenge={handleChallengeSelect} />}
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
      </main>

      {insightModalOpen && challenge && challenge.grade && (
        <InsightModal grade={challenge.grade} onClose={() => setInsightModalOpen(false)} />
      )}
    </div>
  );
}

export default App;