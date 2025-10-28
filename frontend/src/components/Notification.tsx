import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Notification({ message, type, onClose }: NotificationProps) {
  /*
  // Pop-up notification
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const iconColor = isSuccess ? 'text-green-100' : 'text-red-100';
  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div
      className={`fixed top-5 right-5 w-auto max-w-sm p-4 rounded-lg shadow-lg text-white flex items-center z-50 transform transition-all duration-300 animate-slide-in-right ${bgColor}`}
    >
      <div className={`mr-3 ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{isSuccess ? 'Success' : 'Error'}</p>
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
  */

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle : XCircle;
  const colorClass = isSuccess
    ? 'border-green-500 text-green-600 dark:text-green-400'
    : 'border-red-500 text-red-600 dark:text-red-400';

  return (
    <div className={`w-full max-w-sm mx-auto mb-4 flex items-start gap-3 rounded-lg border px-4 py-3 bg-white dark:bg-slate-900 shadow-sm ${colorClass}`}>
      <Icon className="w-5 h-5 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{isSuccess ? 'Berhasil' : 'Terjadi Kesalahan'}</p>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
      <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200">
        Tutup
      </button>
    </div>
  );
}
