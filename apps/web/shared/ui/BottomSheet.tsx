"use client";

import { Dispatch, SetStateAction } from "react";

export const BottomSheet = ({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <dialog open={isOpen} onClick={handleClose} className="fixed inset-0 z-50">
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
      />

      <div
        className={`fixed bottom-0 -translate-x-1/2 left-1/2 max-w-3xl z-50 w-full bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out 
          ${isOpen ? "translate-y-0" : "translate-y-full"}`}
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
