import { LogIn, LogOut, User } from 'lucide-react';

interface AuthButtonProps {
  isAuthenticated: boolean;
  userEmail?: string | null;
  onLogin: () => void;
  onLogout: () => void;
  onViewProfile: () => void;
}

export function AuthButton({
  isAuthenticated,
  userEmail,
  onLogin,
  onLogout,
  onViewProfile,
}: AuthButtonProps) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={onViewProfile}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-100 font-semibold py-2 px-4 rounded-lg shadow transition-all"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{userEmail}</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onLogin}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all"
    >
      <LogIn className="w-4 h-4" />
      Login
    </button>
  );
}
