"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0E0C12]/95 group-[.toaster]:backdrop-blur-2xl group-[.toaster]:text-[#E6E3E8] group-[.toaster]:border group-[.toaster]:border-[#A24BE0]/30 group-[.toaster]:shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(122,34,176,0.25)] group-[.toaster]:rounded-2xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-[#8C8890] text-xs mt-1",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-[#8E2CCB] group-[.toast]:to-[#7A22B0] group-[.toast]:text-white font-semibold rounded-xl text-xs px-3.5 py-1.5 shadow-md shadow-[#7A22B0]/30",
          cancelButton:
            "group-[.toast]:bg-white/[0.06] group-[.toast]:text-[#8C8890] hover:group-[.toast]:text-white font-medium rounded-xl text-xs px-3.5 py-1.5",
        },
      }}
    />
  );
}
