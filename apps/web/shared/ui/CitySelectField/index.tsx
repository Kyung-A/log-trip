"use client";

import { IRegion } from "@/features/region";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Field } from "./Field";
import { CitySelectDialog } from "./CitySelectDialog";
import { Control, FieldValues, Path } from "react-hook-form";

interface ICitySelectField<T extends FieldValues> {
  value: IRegion[];
  options?: IRegion[] | null;
  onConfirm: React.Dispatch<React.SetStateAction<IRegion[]>>;
  fieldName: Path<T>;
  control: Control<T>;
}

export const CitySelectField = <T extends FieldValues>({
  value,
  options,
  onConfirm,
  fieldName,
  control,
}: ICitySelectField<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [draft, setDraft] = useState<IRegion[]>([]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggle = useCallback((item: IRegion) => {
    setDraft((prev) => {
      const isSelected = prev?.some(
        (data) => data.region_code === item.region_code
      );

      if (isSelected) {
        return prev?.filter((p) => !(p.region_code === item.region_code));
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(draft);
    handleClose();
  }, [draft, handleClose, onConfirm]);

  const filteredList = useMemo(() => {
    return options?.filter(
      (v) => v.region_name.includes(search) || v.country_name.includes(search)
    );
  }, [options, search]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <>
      <Field
        onOpen={handleOpen}
        value={value}
        fieldName={fieldName}
        control={control}
      />
      <CitySelectDialog
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        onCheckboxToggle={handleToggle}
        draft={draft}
        filteredList={filteredList}
      />
    </>
  );
};

CitySelectField.displayName = "CitySelectField";
