"use client";

import {
  CompanionForm,
  ICompanionRequest,
  useCreateCompanion,
} from "@/features/companion";
import { IRegion } from "@/features/region";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

export default function CreateCompanion() {
  const router = useRouter();

  const [cities, setCities] = useState<IRegion[]>([]);
  const { mutateAsync } = useCreateCompanion();

  const methods = useForm({
    mode: "onSubmit",
  });

  const handleCreateCompanion = methods.handleSubmit(
    async (formData: ICompanionRequest) => {
      const body = {
        ...formData,
        companion_regions: cities.map((v) => ({
          region_code: v.region_code,
          region_name: v.region_name,
          shape_name: v.shape_name,
          country_code: v.country_code,
          country_name: v.country_name,
        })),
      };

      const resp = await mutateAsync(body);
      if (resp.status === 201) {
        router.push(`/companion/${resp.data.id}`);
      }
    },
    (error) => {
      toast.error(Object.values(error)[0].message);
    }
  );

  return (
    <FormProvider {...methods}>
      <CompanionForm
        cities={cities}
        setCities={setCities}
        handleCreateCompanion={handleCreateCompanion}
      />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        theme="colored"
      />
    </FormProvider>
  );
}
