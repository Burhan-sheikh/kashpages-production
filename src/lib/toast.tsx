import toast from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

function showToast(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
) {
  const Icon = iconMap[type];
  const color = colorMap[type];

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-fade-in' : 'opacity-0'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    ),
    { duration: 4000 }
  );
}

export const showSuccess = (message: string) => showToast(message, 'success');
export const showError = (message: string) => showToast(message, 'error');
export const showWarning = (message: string) => showToast(message, 'warning');
export const showInfo = (message: string) => showToast(message, 'info');
