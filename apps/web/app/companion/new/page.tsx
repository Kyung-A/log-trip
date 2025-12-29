"use client";

import { CompanionForm } from "@/features/companion";
import { ToastContainer } from "react-toastify";

export default function CreateCompanion() {
  return (
    <>
      <CompanionForm />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        theme="colored"
      />
    </>
  );
}
