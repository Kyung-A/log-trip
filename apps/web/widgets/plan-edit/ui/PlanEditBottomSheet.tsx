"use client";

import { useState } from "react";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { ITravelPlan } from "@/entities/plan";
import { IRegion } from "@/entities/region";

import { CitySelectList, PlanStep2 } from "@/features/plan-create";
import { updatePlanAction } from "@/features/plan-update";

import { FormBottomSheet } from "@/shared/ui";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface EditFormValues {
  cities: IRegion[];
  dateRange: DateRange;
}

interface PlanEditBottomSheetProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  plan: ITravelPlan;
  regions: IRegion[];
}

export const PlanEditBottomSheet = ({
  isOpen,
  setIsOpen,
  plan,
  regions,
}: PlanEditBottomSheetProps) => {
  const router = useRouter();
  const [editStep, setEditStep] = useState<1 | 2>(1);

  const { watch, setValue, handleSubmit, formState, reset } =
    useForm<EditFormValues>({
      defaultValues: {
        cities: regions.filter((r) =>
          plan.region_names.includes(r.region_name),
        ),
        dateRange: {
          start: new Date(plan.start_date),
          end: new Date(plan.end_date),
        },
      },
    });

  const cities = watch("cities");
  const dateRange = watch("dateRange");

  const handleClose = () => {
    setIsOpen(false);
    setEditStep(1);
    reset();
  };

  const onSubmit = async (data: EditFormValues) => {
    if (!data.dateRange.start || !data.dateRange.end) return;

    await updatePlanAction({
      id: plan.id,
      region_names: data.cities.map((c) => c.region_name),
      start_date: dayjs(data.dateRange.start).format("YYYY-MM-DD"),
      end_date: dayjs(data.dateRange.end).format("YYYY-MM-DD"),
    });

    handleClose();
    router.refresh();
  };

  return (
    <FormBottomSheet isOpen={isOpen} setIsOpen={setIsOpen} title="일정 수정">
      <form onSubmit={handleSubmit(onSubmit)}>
        {editStep === 1 ? (
          <div className="min-h-[60vh]">
            <p className="px-4 py-3 text-sm font-semibold text-zinc-500">
              여행 지역
            </p>
            <CitySelectList
              value={cities}
              onConfirm={(val) => setValue("cities", val)}
              options={regions}
            />
          </div>
        ) : (
          <div className="min-h-[60vh]">
            <PlanStep2
              value={dateRange}
              onChange={(val) => setValue("dateRange", val)}
            />
          </div>
        )}

        <div className="px-4 pb-8 pt-3 flex gap-x-2">
          {editStep === 1 ? (
            <button
              type="button"
              disabled={cities.length === 0}
              onClick={() => setEditStep(2)}
              className="flex-1 bg-latte text-white font-semibold py-3 rounded-lg disabled:bg-zinc-200 disabled:text-zinc-400"
            >
              다음
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setEditStep(1)}
                className="flex-1 border border-zinc-300 text-zinc-600 font-semibold py-3 rounded-lg"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={
                  !dateRange.start ||
                  !dateRange.end ||
                  formState.isSubmitting
                }
                className="flex-1 bg-latte text-white font-semibold py-3 rounded-lg disabled:bg-zinc-200 disabled:text-zinc-400"
              >
                {formState.isSubmitting ? "수정 중..." : "완료"}
              </button>
            </>
          )}
        </div>
      </form>
    </FormBottomSheet>
  );
};
