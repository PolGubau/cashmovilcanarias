"use client";

import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import React from "react";
/**
 * Toast centralizado sobre react-hot-toast.
 * Uso: import { toast } from "@/components/ui/toast"
 *      toast.success("Guardado"), toast.error("Error"), etc.
 */
import {
  type ToastOptions,
  Toaster as _Toaster,
  toast as _toast,
} from "react-hot-toast";

const baseStyle: ToastOptions = {
  duration: 4000,
  style: {
    background: "#fff",
    color: "#1C274C",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    boxShadow: "0px 6px 24px 0px rgba(235,238,251,0.4), 0px 2px 4px 0px rgba(148,163,184,0.05)",
    padding: "12px 16px",
    maxWidth: "380px",
  },
};

export const toast = {
  success: (msg: string, opts?: ToastOptions) =>
    _toast.success(msg, {
      ...baseStyle,
      ...opts,
      iconTheme: { primary: "#22AD5C", secondary: "#fff" },
    }),

  error: (msg: string, opts?: ToastOptions) =>
    _toast.error(msg, {
      ...baseStyle,
      ...opts,
      iconTheme: { primary: "#F23030", secondary: "#fff" },
    }),

  info: (msg: string, opts?: ToastOptions) =>
    _toast(msg, {
      ...baseStyle,
      ...opts,
      icon: React.createElement(Info, { className: "h-5 w-5 text-blue shrink-0" }),
    }),

  warning: (msg: string, opts?: ToastOptions) =>
    _toast(msg, {
      ...baseStyle,
      ...opts,
      icon: React.createElement(AlertTriangle, { className: "h-5 w-5 text-yellow-dark shrink-0" }),
    }),

  loading: (msg: string, opts?: ToastOptions) =>
    _toast.loading(msg, { ...baseStyle, ...opts }),

  dismiss: _toast.dismiss,
  promise: _toast.promise,
};

/** Drop-in <Toaster /> - mount once in root layout */
export function Toaster() {
  return (
    <_Toaster
      position="top-right"
      gutter={8}
      containerStyle={{ top: 16, right: 16 }}
      toastOptions={baseStyle}
    />
  );
}
