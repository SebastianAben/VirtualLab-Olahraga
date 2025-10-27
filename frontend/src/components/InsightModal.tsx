import { useEffect, useState } from 'react';
import { X, Lightbulb, Target, HeartPulse, TrendingUp } from 'lucide-react';
import * as api from '../lib/api';
import { GradeInsight } from '../types';

interface InsightModalProps {
  grade: string;
  onClose: () => void;
}

export function InsightModal({ grade, onClose }: InsightModalProps) {
  const [insight, setInsight] = useState<GradeInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const insights = await api.getGradeInsights(token);
        setInsight(insights[grade]);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [grade]);

  if (loading || !insight) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
          <p>Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 transform transition-all duration-300 animate-scale-in">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg`}
            >
              <span className="text-4xl font-bold">{grade}</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{insight.title}</h2>
              <p className="text-gray-500">Your Challenge Feedback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 text-gray-700">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-lg">Your Performance</h3>
            </div>
            <p className="leading-relaxed">{insight.feedback}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="font-bold text-lg">How to Improve</h3>
            </div>
            <p className="leading-relaxed">{insight.improvement}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <HeartPulse className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-lg">Physiological Impact</h3>
            </div>
            <p className="leading-relaxed">{insight.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
