import { Heart, Activity } from 'lucide-react';
import { HeartRateZone, ExerciseIntensity } from '../types';

interface DashboardProps {
  currentHeartRate: number;
  zone: HeartRateZone;
  intensity: ExerciseIntensity;
  onIntensityChange: (intensity: ExerciseIntensity) => void;
}

const ZONE_INFO: Record<
  HeartRateZone,
  { label: string; color: string; bgColor: string; description: string }
> = {
  resting: {
    label: 'Resting',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-100 dark:bg-green-500/15',
    description: '60-94 BPM - Normal resting heart rate',
  },
  'fat-burn': {
    label: 'Fat Burn',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-500/15',
    description: '95-114 BPM - Light exercise, optimal for fat burning',
  },
  cardio: {
    label: 'Cardio',
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-100 dark:bg-amber-500/15',
    description: '115-154 BPM - Moderate to vigorous exercise',
  },
  peak: {
    label: 'Peak',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100 dark:bg-red-500/15',
    description: '155-200 BPM - Maximum effort exercise',
  },
};

export function Dashboard({
  currentHeartRate,
  zone,
  intensity,
  onIntensityChange,
}: DashboardProps) {
  const zoneInfo = ZONE_INFO[zone];

  return (
    <div className="w-full space-y-4">
      <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/40 p-6 transition-colors">
        <div className="flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-red-500 animate-pulse" />
          <h2 className="text-2xl font-bold ml-2 text-gray-800 dark:text-slate-100">Heart Rate Monitor</h2>
        </div>

        <div className="text-center mb-6">
          <div className="text-7xl font-bold text-gray-800 dark:text-slate-100 mb-2">
            {Math.round(currentHeartRate)}
          </div>
          <div className="text-2xl text-gray-600 dark:text-slate-400">BPM</div>
        </div>

        <div
          className={`${zoneInfo.bgColor} ${zoneInfo.color} rounded-lg p-6 transition-all duration-500 transform hover:scale-105`}
        >
          <div className="flex items-center justify-center mb-2">
            <Activity className="w-6 h-6 mr-2" />
            <h3 className="text-2xl font-bold">{zoneInfo.label} Zone</h3>
          </div>
          <p className="text-center text-sm">{zoneInfo.description}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/40 p-6 transition-colors">
        <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 text-center">
          Exercise Controls
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onIntensityChange('rest')}
            className={`py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              intensity === 'rest'
                ? 'bg-green-500 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <div className="text-lg">Rest</div>
            <div className="text-sm opacity-80">70 BPM</div>
          </button>
          <button
            onClick={() => onIntensityChange('jog')}
            className={`py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              intensity === 'jog'
                ? 'bg-amber-500 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <div className="text-lg">Jog</div>
            <div className="text-sm opacity-80">135 BPM</div>
          </button>
          <button
            onClick={() => onIntensityChange('sprint')}
            className={`py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              intensity === 'sprint'
                ? 'bg-red-500 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <div className="text-lg">Sprint</div>
            <div className="text-sm opacity-80">175 BPM</div>
          </button>
        </div>
      </div>
    </div>
  );
}
