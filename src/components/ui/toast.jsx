/**
 * Toast notification component using Radix UI Toast primitive
 * Compatible with shadcn/ui styling
 */
import * as React from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = React.createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback(
    ({ title, description, variant = "default", duration = 5000 }) => {
      const id = Date.now() + Math.random();
      const toast = { id, title, description, variant };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useMemo(
    () => ({
      success: (title, description) =>
        addToast({ title, description, variant: "success" }),
      error: (title, description) =>
        addToast({ title, description, variant: "error" }),
      warning: (title, description) =>
        addToast({ title, description, variant: "warning" }),
      info: (title, description) =>
        addToast({ title, description, variant: "info" }),
      default: (title, description) =>
        addToast({ title, description, variant: "default" }),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const variantConfig = {
  default: {
    icon: Info,
    containerClass: "bg-white border-[#E5E7EB]",
    iconClass: "text-[#6B7280]",
  },
  success: {
    icon: CheckCircle2,
    containerClass: "bg-white border-green-200",
    iconClass: "text-green-500",
  },
  error: {
    icon: AlertCircle,
    containerClass: "bg-white border-red-200",
    iconClass: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    containerClass: "bg-white border-amber-200",
    iconClass: "text-amber-500",
  },
  info: {
    icon: Info,
    containerClass: "bg-white border-blue-200",
    iconClass: "text-blue-500",
  },
};

function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const config = variantConfig[toast.variant] || variantConfig.default;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "pointer-events-auto animate-slide-in-right",
        "flex items-start gap-3 p-4 rounded-xl border shadow-lg",
        "backdrop-blur-lg transition-all duration-300",
        config.containerClass
      )}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconClass)} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-[#1F2937]">{toast.title}</p>
        )}
        {toast.description && (
          <p className="text-sm text-[#6B7280] mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 rounded-lg p-1 text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Add slide-in animation to index.css or here via style tag
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
`;
document.head.appendChild(styleSheet);

export { Toast, ToastContainer };
