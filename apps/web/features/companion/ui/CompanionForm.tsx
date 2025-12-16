"use client";

import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";
import { IRegion, useFetchRegions } from "@/features/region";
import { ICompanion } from "..";
import { CitySelectField } from "@/shared";
import Picker from "react-mobile-picker";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps {
  cities: IRegion[];
  setCities: React.Dispatch<React.SetStateAction<IRegion[]>>;
  defaultValues?: ICompanion;
}

export function CompanionForm({
  cities,
  setCities,
  defaultValues,
  handleCreateCompanion,
}: IProps) {
  const router = useRouter();

  const { data: regions } = useFetchRegions();
  const { control, watch, reset, setValue } = useFormContext();

  useEffect(() => {
    if (defaultValues) {
      const {
        user_info,
        companion_regions,
        created_at,
        updated_at,
        deadline_at,
        start_date,
        end_date,
        applications,
        ...rest
      } = defaultValues;

      setCities(companion_regions);

      reset({
        ...rest,
        deadline_at: dayjs(deadline_at).toDate(),
        start_date: dayjs(start_date).toDate(),
        end_date: dayjs(end_date).toDate(),
      });
    }
  }, [defaultValues, reset, setCities]);

  useEffect(() => {
    setValue("companion_regions", cities, {
      shouldValidate: true,
    });
  }, [cities, setValue]);

  return (
    <>
      <header className="sticky h-10 top-0 z-30 w-full bg-white border-b border-gray-300 flex items-center px-2">
        <button
          onClick={() =>
            defaultValues
              ? router.push(`/companion/${defaultValues.id}`)
              : router.push("/companion")
          }
        >
          <ChevronLeft size={30} color="#646464" />
        </button>
        <button
          type="submit"
          onClick={handleCreateCompanion}
          className="ml-auto text-lg text-blue-500 font-semibold px-2"
        >
          등록
        </button>
      </header>

      <CitySelectField
        label="도시 선택"
        value={cities}
        onConfirm={setCities}
        options={regions}
      />
      <Controller
        name="companion_regions"
        control={control}
        rules={{
          validate: (v) => v.length > 0 || "도시를 선택해주세요",
        }}
        render={() => <></>}
      />

      <Controller
        control={control}
        name="companion_count"
        rules={{
          required: "동행수는 필수입니다.",
        }}
        render={({ field: { onChange, value } }) => (
          <label className="flex justify-between w-full px-4 py-3 border-b border-gray-300">
            <p className="text-lg">동행수</p>
            <Picker
              value={{ companion_count: value ?? 1 }}
              onChange={(v) => onChange(v.companion_count)}
              wheelMode="natural"
              height={30}
            >
              <Picker.Column name="companion_count" className="text-gray-500">
                {Array.from({ length: 6 }, (_, i) => (
                  <Picker.Item
                    key={i + 1}
                    value={i + 1}
                    style={{ fontSize: 18 }}
                  >
                    {i + 1}
                  </Picker.Item>
                ))}
              </Picker.Column>
            </Picker>
          </label>
        )}
      />

      <Controller
        control={control}
        name="gender_preference"
        rules={{
          required: "성별은 필수입니다.",
        }}
        render={({ field: { onChange, value } }) => (
          <label className="flex justify-between w-full px-4 py-3 border-b border-gray-300">
            <p className="text-lg">성별</p>
            <Picker
              value={{ gender_preference: value ?? "R" }}
              onChange={(v) => onChange(v.gender_preference)}
              wheelMode="natural"
              height={30}
              disabled={!!defaultValues}
              className="text-gray-500"
            >
              <Picker.Column name="gender_preference">
                <Picker.Item key="R" value="R" style={{ fontSize: 18 }}>
                  무관
                </Picker.Item>
                <Picker.Item key="F" value="F" style={{ fontSize: 18 }}>
                  여성
                </Picker.Item>
                <Picker.Item key="M" value="M" style={{ fontSize: 18 }}>
                  남성
                </Picker.Item>
              </Picker.Column>
            </Picker>
          </label>
        )}
      />

      <Controller
        control={control}
        name="deadline_at"
        rules={{
          required: "모집 마감은 필수입니다.",
        }}
        render={({ field: { onChange, value } }) => (
          <label className="flex justify-between w-full px-4 py-3 border-b border-gray-300">
            <p className="text-lg">모집 마감</p>
            <input
              type="datetime-local"
              value={value ? dayjs(value).format("YYYY-MM-DD hh:mm") : ""}
              onChange={(e) => {
                const selected = dayjs(e.target.value);
                const now = dayjs().set("minute", 1);

                if (selected.isBefore(now)) {
                  alert("현재 시간 이후만 선택할 수 있습니다.");
                  return;
                }

                onChange(e);
              }}
              min={dayjs().format("YYYY-MM-DDTHH:mm")}
              className="text-right text-gray-500"
            />
          </label>
        )}
      />

      <Controller
        control={control}
        name="start_date"
        rules={{
          required: "동행 시작일은 필수입니다.",
        }}
        render={({ field: { onChange, value } }) => (
          <label className="flex justify-between w-full px-4 py-3 border-b border-gray-300">
            <p className="text-lg">동행 시작</p>
            <input
              type="datetime-local"
              value={value ? dayjs(value).format("YYYY-MM-DD hh:mm") : ""}
              onChange={(e) => {
                const selected = dayjs(e.target.value);
                const now = dayjs().set("minute", 1);

                if (selected.isBefore(now)) {
                  alert("현재 시간 이후만 선택할 수 있습니다.");
                  return;
                }

                setValue("end_date", null);
                onChange(e);
              }}
              min={dayjs().format("YYYY-MM-DDTHH:mm")}
              className="text-right text-gray-500"
            />
          </label>
        )}
      />

      <Controller
        control={control}
        name="end_date"
        rules={{
          required: "동행 종료일은 필수입니다.",
        }}
        render={({ field: { onChange, value } }) => (
          <label className="flex justify-between w-full px-4 py-3 border-b border-gray-300">
            <p className="text-lg">동행 종료</p>
            <input
              type="datetime-local"
              value={value ? dayjs(value).format("YYYY-MM-DD hh:mm") : ""}
              onChange={(e) => {
                const selected = dayjs(e.target.value);
                const now = dayjs(watch("start_date"));

                if (selected.isBefore(now)) {
                  alert("동행 시작 시간 이후만 선택할 수 있습니다.");
                  return;
                }

                onChange(e);
              }}
              min={dayjs(watch("start_date")).format("YYYY-MM-DDTHH:mm")}
              className="text-right text-gray-500"
            />
          </label>
        )}
      />

      <Controller
        control={control}
        name="place"
        render={({ field: { value, onChange } }) => (
          <label className="flex justify-between w-full px-4 py-3 border-b border-gray-300">
            <p className="mr-4 text-lg">장소</p>
            <input
              className="text-lg leading-6 text-right text-gray-500 w-80 outline-0"
              placeholder="구체적인 만남 장소"
              onChange={onChange}
              value={value}
              maxLength={20}
            />
          </label>
        )}
      />

      <div className="p-4">
        <Controller
          control={control}
          name="title"
          rules={{
            required: "제목은 필수입니다.",
          }}
          render={({ field: { value, onChange } }) => (
            <input
              className="text-xl font-semibold outline-0"
              placeholder="제목을 작성해주세요"
              onChange={onChange}
              maxLength={30}
              defaultValue={value}
            />
          )}
        />

        <Controller
          control={control}
          name="content"
          rules={{
            required: "내용은 필수입니다.",
          }}
          render={({ field: { value, onChange } }) => (
            <textarea
              className="pb-20 mt-4 text-lg resize-none w-full h-[40vh] outline-0"
              placeholder="내용을 작성해주세요"
              onChange={onChange}
              defaultValue={value}
            />
          )}
        />
      </div>
    </>
  );
}
