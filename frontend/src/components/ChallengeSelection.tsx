import { useEffect, useState } from 'react';
import { Challenge } from '../types';
import * as api from '../lib/api';
import { BookOpen, Target, Clock } from 'lucide-react';

interface ChallengeSelectionProps {
  onSelectChallenge: (challenge: Omit<Challenge, 'elapsedTime' | 'timeInZone' | 'completed' | 'grade'>) => void;
}

export function ChallengeSelection({ onSelectChallenge }: ChallengeSelectionProps) {
  const [challenges, setChallenges] = useState<Omit<Challenge, 'elapsedTime' | 'timeInZone' | 'completed' | 'grade'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const fetchedChallenges = await api.getChallenges(token);
        setChallenges(fetchedChallenges);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-slate-200">
        Loading challenges...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 py-12 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-slate-100 mb-3">Choose Your Challenge</h1>
          <p className="text-lg text-gray-600 dark:text-slate-300">
            Select an exercise simulation to test your cardiovascular control.
          </p>
        </div>

        <div className="space-y-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-xl shadow-lg dark:shadow-slate-900/40 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">{challenge.name}</h2>
                <p className="text-gray-600 dark:text-slate-300 mb-4">{challenge.description}</p>

                <div className="flex items-center gap-6 text-sm text-gray-700 dark:text-slate-300 mb-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span>Goal: {formatDuration(challenge.goalDuration)} in zone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span>Total Time: {formatDuration(challenge.totalDuration)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-500/10 border-l-4 border-blue-400 dark:border-blue-500/60 p-4 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">Why this is a good challenge:</h4>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-200">{challenge.benefit}</p>
                </div>

                <button
                  onClick={() => onSelectChallenge(challenge)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Select Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
