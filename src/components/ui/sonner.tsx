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
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#11271D] group-[.toaster]:border group-[.toaster]:border-[#D5EAE0] group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-[#527060] text-xs mt-1",
          actionButton:
            "group-[.toast]:bg-[#059669] group-[.toast]:hover:bg-[#047857] group-[.toast]:text-white font-semibold rounded-xl text-xs px-3.5 py-1.5 shadow-md shadow-[#059669]/20",
          cancelButton:
            "group-[.toast]:bg-white/[0.06] group-[.toast]:text-[#8C8890] hover:group-[.toast]:text-white font-medium rounded-xl text-xs px-3.5 py-1.5",
        },
      }}
    />
  );
}
