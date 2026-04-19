"use client";

import { useState } from "react";

import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { IRegion } from "@/entities/region";

import { navigateNative } from "@/shared";

import { createPlanAction } from "../model";
import { CitySelectList } from "./CitySelectList";
import { PlanStep2 } from "./PlanStep2";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface PlanFormValues {
  cities: IRegion[];
  dateRange: DateRange;
}

export const PlanForm = ({ regions }: { regions: IRegion[] | null }) => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const { watch, setValue, handleSubmit, formState } = useForm<PlanFormValues>({
    defaultValues: {
      cities: [],
      dateRange: { start: null, end: null },
    },
  });

  const cities = watch("cities");
  const dateRange = watch("dateRange");

  const onSubmit = async (data: PlanFormValues) => {
    if (!data.dateRange.start || !data.dateRange.end) return;

    const result = await createPlanAction({
      region_names: data.cities.map((c) => c.region_name),
      start_date: dayjs(data.dateRange.start).format("YYYY-MM-DD"),
      end_date: dayjs(data.dateRange.end).format("YYYY-MM-DD"),
    });

    if (result.success || result.id) {
      router.push(`/plan/${result.id}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-screen overflow-hidden"
    >
      <header className="bg-white flex sticky top-0 w-full py-2 border-b border-zinc-200 px-4 z-20">
        <button
          type="button"
          onClick={() =>
            step === 1 ? navigateNative("/plan", "BACK") : setStep(1)
          }
          className="flex items-center gap-x-1"
        >
          <ChevronLeft size={22} color="#646464" />
          <span className="text-lg">뒤로</span>
        </button>
        <p className="text-lg -translate-x-[45%] mx-auto font-semibold">
          여행 일정
        </p>
      </header>

      <main className="flex-1 overflow-hidden">
        {step === 1 ? (
          <>
            <h1 className="text-xl font-semibold px-6 pt-4 pb-2">
              어디로 떠나시나요?
            </h1>
            <CitySelectList
              value={cities}
              onConfirm={(val) => setValue("cities", val)}
              options={regions || []}
            />
          </>
        ) : (
          <PlanStep2
            value={dateRange}
            onChange={(val) => setValue("dateRange", val)}
          />
        )}
      </main>

      <footer className="bg-white max-w-3xl pt-4 pb-14 w-full border-t border-zinc-200 px-4 fixed bottom-0">
        {step === 1 ? (
          <button
            type="button"
            disabled={cities.length === 0}
            onClick={() => setStep(2)}
            className="w-full bg-latte text-white font-semibold disabled:text-zinc-400 py-3 text-base block rounded-lg disabled:bg-zinc-200"
          >
            다음
          </button>
        ) : (
          <button
            type="submit"
            disabled={
              !dateRange.start ||
              !dateRange.end ||
              formState.isSubmitting
            }
            className="w-full bg-latte text-white font-semibold disabled:text-zinc-400 py-3 text-base block rounded-lg disabled:bg-zinc-200"
          >
            {formState.isSubmitting ? "생성 중..." : "완료"}
          </button>
        )}
      </footer>
    </form>
  );
};

PlanForm.displayName = "PlanForm";
