import { ArrowLeft, Trophy, Calendar, Award } from 'lucide-react';
import { SimulationResult } from '../types';

interface ProfilePageProps {
  userEmail: string;
  results: SimulationResult[];
  onBack: () => void;
}

export function ProfilePage({ userEmail, results, onBack }: ProfilePageProps) {
  const sortedResults = [...results].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const averageGrade = results.length > 0
    ? results.reduce((sum, r) => {
        const gradePoints: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 };
        return sum + (gradePoints[r.grade] || 0);
      }, 0) / results.length
    : 0;

  const gradeFromPoints = (points: number): string => {
    if (points >= 3.5) return 'A';
    if (points >= 2.5) return 'B';
    if (points >= 1.5) return 'C';
    if (points >= 0.5) return 'D';
    return 'F';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-300 dark:border-green-400/40';
      case 'B':
        return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-400/40';
      case 'C':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-400/40';
      case 'D':
        return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-400/40';
      case 'F':
        return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-400/40';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-slate-700/40 dark:text-slate-200 dark:border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 py-8 px-4 transition-colors text-gray-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Lab
        </button>

        <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/40 p-8 mb-6 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">My Profile</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                <h3 className="font-semibold text-gray-700 dark:text-slate-300">Email</h3>
              </div>
              <p className="text-lg text-gray-800 dark:text-slate-100">{userEmail}</p>
            </div>

            <div className="bg-green-50 dark:bg-green-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-green-600 dark:text-green-300" />
                <h3 className="font-semibold text-gray-700 dark:text-slate-300">Total Challenges</h3>
              </div>
              <p className="text-3xl font-bold text-gray-800 dark:text-slate-100">{results.length}</p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                <h3 className="font-semibold text-gray-700 dark:text-slate-300">Average Grade</h3>
              </div>
              <p className="text-3xl font-bold text-gray-800 dark:text-slate-100">
                {results.length > 0 ? gradeFromPoints(averageGrade) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/40 p-8 transition-colors">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-gray-700 dark:text-slate-300" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Challenge History</h2>
          </div>

          {sortedResults.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-300 text-lg">No challenges completed yet</p>
              <p className="text-gray-400 dark:text-slate-400 text-sm mt-2">
                Complete challenges in the lab to see your results here!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedResults.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-slate-900/40 transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-1">
                        {result.challenge}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-300">
                        <span>Time: {result.timeAchieved.toFixed(1)}s</span>
                        <span className="text-gray-400 dark:text-slate-500">|</span>
                        <span>{formatDate(result.timestamp)}</span>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg border-2 font-bold text-lg ${getGradeColor(
                        result.grade
                      )}`}
                    >
                      {result.grade}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
