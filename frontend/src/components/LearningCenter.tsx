import { Dumbbell, Activity, Brain, HeartPulse, Target, RotateCcw, ArrowRight, BookOpen, Flame } from 'lucide-react';

export interface LearningChapter {
  id: string;
  title: string;
  summary: string;
  icon: 'book' | 'activity' | 'brain' | 'heart' | 'target' | 'recovery';
  takeaways: string[];
  recommendedReading?: string[];
  detailedContent?: string[];
}

const iconMap: Record<LearningChapter['icon'], JSX.Element> = {
  book: <Dumbbell className="w-8 h-8 text-indigo-500" />,
  activity: <Activity className="w-8 h-8 text-amber-500" />,
  brain: <RotateCcw className="w-8 h-8 text-emerald-500" />,
  heart: <HeartPulse className="w-8 h-8 text-rose-500" />,
  target: <Target className="w-8 h-8 text-blue-500" />,
  recovery: <Flame className="w-8 h-8 text-purple-500" />,
};

interface LearningCenterProps {
  chapters: LearningChapter[];
  onSelectChapter: (chapterId: string) => void;
}

export function LearningCenter({ chapters, onSelectChapter }: LearningCenterProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-10 text-gray-800 dark:text-slate-200 transition-colors">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/60 backdrop-blur px-4 py-2 rounded-full shadow">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
            Learning Center
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100">
          Pelajari Ilmu Kebugaran Jasmani
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
          Kumpulan materi yang dibuat khusus untuk membantu pemahaman akan materi kebugaran jasmani.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chapters.map((chapter) => (
          <button
            type="button"
            key={chapter.id}
            onClick={() => onSelectChapter(chapter.id)}
            className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 border border-indigo-50 dark:border-indigo-500/30 p-6 flex flex-col gap-4 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                {iconMap[chapter.icon]}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{chapter.title}</h2>
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mt-3">{chapter.summary}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-indigo-400 dark:text-indigo-300 mt-1" />
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}
