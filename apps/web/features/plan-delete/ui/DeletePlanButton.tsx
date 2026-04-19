"use client";

import { useRouter } from "next/navigation";

import { deletePlanAction } from "../model";

interface DeletePlanButtonProps {
  planId: string;
  redirectTo?: string;
  className?: string;
  children?: React.ReactNode;
}

export const DeletePlanButton = ({
  planId,
  redirectTo,
  className,
  children = "삭제",
}: DeletePlanButtonProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    await deletePlanAction(planId);

    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.refresh();
    }
  };

  return (
    <button type="button" onClick={handleDelete} className={className}>
      {children}
    </button>
  );
};
