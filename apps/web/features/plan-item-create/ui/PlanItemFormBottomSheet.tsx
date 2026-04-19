"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { IPlanItem } from "@/entities/plan";

import { FormBottomSheet } from "@/shared/ui";

import { createPlanItemAction } from "../model";

interface PlanItemFormValues {
  title: string;
  time: string;
  place: string;
  memo: string;
}

interface PlanItemFormBottomSheetProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  planId: string;
  dayNumber: number;
  defaultValues?: IPlanItem;
  onSuccess?: () => void;
  onSubmitAction?: (
    values: PlanItemFormValues,
  ) => Promise<{ success: boolean; error?: string }>;
}

export const PlanItemFormBottomSheet = ({
  isOpen,
  setIsOpen,
  planId,
  dayNumber,
  defaultValues,
  onSuccess,
  onSubmitAction,
}: PlanItemFormBottomSheetProps) => {
  const isEdit = !!defaultValues;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlanItemFormValues>({
    defaultValues: {
      title: defaultValues?.title ?? "",
      time: defaultValues?.time ?? "",
      place: defaultValues?.place ?? "",
      memo: defaultValues?.memo ?? "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: defaultValues?.title ?? "",
        time: defaultValues?.time ?? "",
        place: defaultValues?.place ?? "",
        memo: defaultValues?.memo ?? "",
      });
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = async (data: PlanItemFormValues) => {
    const action =
      onSubmitAction ??
      ((values: PlanItemFormValues) =>
        createPlanItemAction({
          plan_id: planId,
          day_number: dayNumber,
          title: values.title,
          time: values.time,
          place: values.place || null,
          memo: values.memo || null,
        }));

    const result = await action(data);
    if (!result.success) return;

    setIsOpen(false);
    onSuccess?.();
  };

  return (
    <FormBottomSheet
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={isEdit ? "일정 수정" : "일정 추가"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 flex flex-col gap-y-4 w-full"
      >
        <div>
          <label className="block text-base font-semibold text-zinc-700 mb-1">
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            {...register("title", { required: "제목을 입력해주세요." })}
            placeholder="일정 제목"
            className="w-full border border-zinc-300 rounded-lg px-3 py-3 text-base outline-none focus:border-latte"
          />
        </div>

        <div className="flex items-center gap-x-4">
          <div className="w-1/2">
            <label className="block text-base font-semibold text-zinc-700 mb-1">
              시간 <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              {...register("time", { required: "시간을 입력해주세요." })}
              className="border time-input h-12 border-zinc-300 rounded-lg px-3 text-base outline-none focus:border-latte"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-base font-semibold text-zinc-700 mb-1">
              장소
            </label>
            <input
              {...register("place")}
              placeholder="장소"
              className="border w-full border-zinc-300 rounded-lg px-3 py-3 text-base outline-none focus:border-latte"
            />
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold text-zinc-700 mb-1">
            메모
          </label>
          <textarea
            {...register("memo")}
            placeholder="메모"
            rows={3}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-base outline-none focus:border-latte resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-latte text-white font-semibold py-3 rounded-lg disabled:bg-zinc-200 disabled:text-zinc-400 mb-4"
        >
          {isSubmitting ? "저장 중..." : "완료"}
        </button>
      </form>
    </FormBottomSheet>
  );
};
