"use client";

import { Dispatch, SetStateAction } from "react";

export const FormBottomSheet = ({
  isOpen,
  setIsOpen,
  title,
  children,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  children: React.ReactNode;
}) => {
  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <dialog open={isOpen} onClick={handleClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" />

      <div
        className="fixed bottom-0 -translate-x-1/2 left-1/2 max-w-3xl z-50 w-full bg-white rounded-t-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-300" />
        </div>
        {title && (
          <h2 className="text-center text-base font-semibold py-3 border-b border-zinc-100">
            {title}
          </h2>
        )}
        <div className="overflow-y-auto max-h-[80vh] pb-safe">{children}</div>
      </div>
    </dialog>
  );
};
