import { ArrowLeft, Bookmark, BookOpen, ClipboardList, Flame, RotateCcw } from 'lucide-react';
import type { LearningChapter } from './LearningCenter';

interface LearningChapterDetailProps {
  chapter: LearningChapter;
  onBack: () => void;
}

export function LearningChapterDetail({ chapter, onBack }: LearningChapterDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-gray-800 dark:text-slate-200 transition-colors">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Learning Center
      </button>

      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold">
          <Bookmark className="w-4 h-4" />
          Materi Perkuliahan
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100">
          {chapter.title}
        </h1>
        <p className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed">{chapter.summary}</p>
      </header>

      <section className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
          <ClipboardList className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Pokok Bahasan</h2>
        </div>
        <ul className="space-y-3">
          {chapter.takeaways.map((point, index) => (
            <li
              key={index}
              className="flex items-start gap-3 bg-indigo-50/70 dark:bg-indigo-500/10 text-gray-700 dark:text-slate-200 rounded-xl px-4 py-3"
            >
              <span className="mt-1 inline-flex w-6 h-6 items-center justify-center rounded-full bg-indigo-500 text-white text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {chapter.detailedContent && chapter.detailedContent.length > 0 && (
        <section className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Penjelasan Materi</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-slate-200">
            {chapter.detailedContent.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {chapter.recommendedReading && chapter.recommendedReading.length > 0 && (
        <section className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Referensi Rekomendasi</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed text-gray-700 dark:text-slate-200">
            {chapter.recommendedReading.map((ref, index) => (
              <li key={index}>{ref}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
