"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <dialog open className="fixed inset-0 z-50">
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed bottom-0 -translate-x-1/2 left-1/2 max-w-3xl z-50 w-full bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${visible ? "translate-y-0" : "translate-y-full"}`}
        role="dialog"
        aria-modal="true"
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
