import { Trophy, Play, RotateCcw } from 'lucide-react';
import { Challenge } from '../types';

interface ChallengePanelProps {
  challenge: Challenge;
  onStart: () => void;
  onReset: () => void;
  onSaveResult: () => void;
  isAuthenticated: boolean;
  onViewInsights: () => void;
  onBackToSelection: () => void;
}

export function ChallengePanel({
  challenge,
  onStart,
  onReset,
  onSaveResult,
  isAuthenticated,
  onViewInsights,
  onBackToSelection,
}: ChallengePanelProps) {
  const overallProgress = Math.min(
    (challenge.elapsedTime / challenge.totalDuration) * 100,
    100
  );

  const goalProgress = Math.min(
    (challenge.timeInZone / challenge.goalDuration) * 100,
    100
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/40 p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">Challenge Mode</h3>
        </div>
        {challenge.completed && challenge.grade && (
          <div className="flex items-center gap-2">
            <div className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-lg font-bold">
              Grade: {challenge.grade}
            </div>
            <button
              onClick={onViewInsights}
              className="text-sm text-blue-600 dark:text-blue-300 hover:underline font-semibold"
            >
              View Feedback
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-slate-800/70 dark:border dark:border-slate-700 rounded-lg p-4 mb-4 transition-colors">
        <h4 className="font-semibold text-gray-800 dark:text-slate-100 mb-2">{challenge.name}</h4>
        <p className="text-sm text-gray-600 dark:text-slate-300 mb-3">{challenge.description}</p>

        {/* Goal Progress */}
        <div className="mb-3">
          <div className="flex justify-between items-center text-sm text-gray-700 dark:text-slate-300 mb-1">
            <span>Time in Zone</span>
            <span>{`${formatTime(challenge.timeInZone)} / ${formatTime(challenge.goalDuration)}`}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>

        {/* Overall Timer Progress */}
        <div>
          <div className="flex justify-between items-center text-sm text-gray-700 dark:text-slate-300 mb-1">
            <span>Total Time</span>
            <span>{`${formatTime(challenge.elapsedTime)} / ${formatTime(challenge.totalDuration)}`}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                challenge.completed ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onStart}
          disabled={challenge.completed || challenge.elapsedTime > 0}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:text-gray-100 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
        >
          <Play className="w-5 h-5 mr-2" />
          Start
        </button>
        <button
          onClick={onReset}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={onBackToSelection}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center text-sm"
        >
          Change Challenge
        </button>
      </div>

      {challenge.completed && isAuthenticated && (
        <button
          onClick={onSaveResult}
          className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105"
        >
          Save Result to Profile
        </button>
      )}

      {challenge.completed && !isAuthenticated && (
        <div className="mt-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-3 text-center text-sm text-yellow-800 dark:text-yellow-300">
          Log in to save your results and track your progress!
        </div>
      )}
    </div>
  );
}
