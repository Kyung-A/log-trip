// components/ModalBottomSheet.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const BottomSheet = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.back();
    }, 300);
  };

  return (
    <dialog
      open
      onClick={handleClose}
      className="fixed inset-0 z-50 transition-all"
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-50"
        }`}
      />

      <div
        className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out 
          ${isClosing ? "translate-y-full" : "translate-y-0"}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-4">
          <div className="flex flex-col text-center justify-center text-xl *:border-b *:border-zinc-200 *:font-semibold *:py-3.5 *:text-blue-500 *:last:border-b-0 *:last:text-red-500">
            {children}

            <button onClick={handleClose}>취소</button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
