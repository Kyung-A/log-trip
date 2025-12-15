"use client";

import { useState, useCallback } from "react";

export const Switch = ({ initialChecked = false, onToggle }) => {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleToggle = useCallback(() => {
    const newState = !isChecked;
    setIsChecked(newState);

    if (onToggle) {
      onToggle(newState);
    }
  }, [isChecked, onToggle]);

  return (
    <label className="flex items-center space-x-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="sr-only"
      />

      <div
        className={`
          relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out 
          ${isChecked ? "bg-green-500" : "bg-gray-300"}
        `}
        aria-hidden="true"
      >
        <div
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md 
            transition-transform duration-300 ease-in-out
            ${isChecked ? "translate-x-6" : "translate-x-0"}
          `}
        />
      </div>
    </label>
  );
};
