"use client";

import { useFetchUserId } from "@/features/auth";
import { IDiary, useCreateDiary } from "@/features/diary";
import { IRegion, useFetchRegions } from "@/features/region";
import {
  blobUrlToBase64,
  CitySelectField,
  getImageUrl,
  imageUpload,
  navigateNative,
} from "@/shared";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { UploadDiaryImageField } from "./UploadDiaryImageField";
import { DrawingModeToggle } from "./DrawingModeToggle";
import { ContentEditor } from "./ContentEditor";
import { ImageEditDialog } from "./ImageEditDialog";
import { DrawingCanvasDialog } from "./DrawingCanvasDialog";

const DEFAULT_FORM_VALUES: Partial<IDiary> = {
  user_id: "",
  title: null,
  text_content: "",
  drawing_content: null,
  is_drawing: false,
  travel_date: null,
  diary_images: [],
  diary_regions: [],
};

export const DiaryForm = () => {
  const [cities, setCities] = useState<IRegion[]>([]);
  const [imgs, setImgs] = useState<{ origin: string; modified: string }[]>([]);
  const [isOpenDrawing, setOpenDrawing] = useState<boolean>(false);
  const [isOpenEditMode, setOpenEditMode] = useState<boolean>(false);
  const [capturedDrawingImage, setCapturedDrawingImage] = useState<
    string | null
  >(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [currentEditImage, setCurrentEditImage] = useState<string | null>(null);

  const { data: userId } = useFetchUserId();
  const { data: regions } = useFetchRegions();
  const { mutateAsync } = useCreateDiary();

  const { control, watch, setValue, handleSubmit } = useForm<IDiary>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // 드로잉 <-> 텍스트 모드 전환
  const handleChangeMode = useCallback(
    (state: boolean) => {
      let returnState = false;

      if (state) {
        if (
          confirm(
            "드로잉 모드로 전환 하시겠습니까?\n드로잉 모드 전환시 작성한 텍스트는 사라집니다."
          )
        ) {
          setValue("is_drawing", true);
          setOpenDrawing(true);
          returnState = true;
        }
      } else {
        if (
          confirm(
            "텍스트 모드로 전환 하시겠습니까?\n텍스트 모드 전환시 작성한 그림은 사라집니다."
          )
        ) {
          setValue("is_drawing", false);
          setCapturedDrawingImage(null);
        } else {
          returnState = true;
        }
      }

      return returnState;
    },
    [setValue]
  );

  // 드로잉 이미지 캡쳐 핸들러
  const handleDrawingImageCapture = (
    imageDataUrl: string,
    canvasSize: { width: number; height: number }
  ) => {
    setCapturedDrawingImage(imageDataUrl);
    setCanvasSize(canvasSize);
  };

  // 업로드 이미지 편집 취소
  const handleCloseEditMode = useCallback(() => {
    setOpenEditMode(false);
    setCurrentEditImage(null);
  }, [setOpenEditMode, setCurrentEditImage]);

  // 업로드 이미지 편집 완료
  const handleSaveEditMode = useCallback(
    (imageDataUrl: string) => {
      setImgs((prev) =>
        prev.map((i) =>
          i.origin === currentEditImage ? { ...i, modified: imageDataUrl } : i
        )
      );

      handleCloseEditMode();
    },
    [currentEditImage, handleCloseEditMode]
  );

  // supabase 이미지 업로드 및 URL 반환
  const uploadAndGetUrlImage = async (file: string): Promise<string | null> => {
    if (!file) return null;
    let rawInputData: string = file;

    if (file.startsWith("blob:")) {
      try {
        const base64DataUrl = await blobUrlToBase64(file);
        rawInputData = base64DataUrl;
      } catch (error) {
        console.error("Blob URL 변환 중 오류 발생:", error);
        return null;
      }
    }

    try {
      let base64Part: string;

      if (rawInputData.startsWith("data:")) {
        const parts = rawInputData.split(",");
        if (parts.length < 2)
          throw new Error("유효하지 않은 Data URL 형식입니다.");

        base64Part = parts[1];
      } else {
        base64Part = rawInputData;
      }

      const buffer = Buffer.from(base64Part, "base64");
      const path = `diary-images/${userId}/${uuidv4()}.jpg`;

      await imageUpload("log-trip-images", path, buffer);
      const result = getImageUrl("log-trip-images", path);

      return result.publicUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  // 다이어리 생성
  const handleCreateDiary = handleSubmit(
    async (formData: IDiary) => {
      let body = {
        ...formData,
        user_id: userId,
        diary_regions: cities.map((v) => ({
          region_code: v.region_code,
          region_name: v.region_name,
          shape_name: v.shape_name,
          country_code: v.country_code,
          country_name: v.country_name,
        })),
      };

      if (imgs && imgs.length > 0) {
        const results = await Promise.all(
          imgs.map((v) => uploadAndGetUrlImage(v.modified))
        );

        const diaryImagesUrls = results
          .filter((url): url is string => url !== null)
          .map((url) => ({
            url: url,
          }));

        body = { ...body, diary_images: diaryImagesUrls };
      }

      if (formData.is_drawing) {
        const drawingContentUrl = await uploadAndGetUrlImage(
          capturedDrawingImage!
        );
        body = { ...body, drawing_content: drawingContentUrl };
      }

      const result = await mutateAsync(body as IDiary);
      if (result) {
        navigateNative("/diary");
      }
    },
    (error) => {
      toast.error(Object.values(error)[0].message);
    }
  );

  useEffect(() => {
    setValue("diary_regions", cities, {
      shouldValidate: true,
    });
  }, [cities, setValue]);

  return (
    <>
      <header className="sticky h-10 top-0 z-30 w-full bg-white border-b border-gray-300 flex items-center px-2">
        <button
          onClick={() => navigateNative("/diary")}
          className="flex items-center gap-x-1"
        >
          <ChevronLeft size={30} color="#646464" />
          <span className="text-lg">뒤로</span>
        </button>
        <button
          type="submit"
          onClick={handleCreateDiary}
          className="ml-auto text-lg text-blue-500 font-semibold px-2"
        >
          등록
        </button>
      </header>

      <UploadDiaryImageField
        imgs={imgs}
        setImgs={setImgs}
        setOpenEditMode={setOpenEditMode}
        setCurrentEditImage={setCurrentEditImage}
      />

      <CitySelectField
        value={cities}
        onConfirm={setCities}
        options={regions}
        fieldName="diary_regions"
        control={control}
      />

      <Controller
        control={control}
        name="travel_date"
        rules={{
          required: "여행일은 필수입니다.",
        }}
        render={({ field: { onChange, value } }) => (
          <label className="flex flex-wrap items-start justify-between w-full px-4 py-3 border-b border-gray-300">
            <p className="text-lg">여행일</p>
            <input
              type="date"
              value={value as unknown as string}
              onChange={(date) => onChange(date)}
            />
          </label>
        )}
      />

      <Controller
        control={control}
        name="is_public"
        render={({ field: { onChange, value } }) => (
          <div className="flex items-center justify-between w-full px-4 py-3 border-b border-gray-300">
            <label htmlFor="custom-check" className="text-lg">
              공개
            </label>
            <input
              id="custom-check"
              type="checkbox"
              onChange={onChange}
              defaultChecked={value}
              className="pure-checkbox"
            />
          </div>
        )}
      />

      <DrawingModeToggle
        isDrawing={watch("is_drawing")}
        onToggle={(state: boolean) => handleChangeMode(state)}
        onOpen={() => setOpenDrawing(true)}
      />

      <ContentEditor
        isDrawing={watch("is_drawing")}
        capturedDrawingImage={capturedDrawingImage}
        imageSize={canvasSize}
        control={control}
      />

      <DrawingCanvasDialog
        isOpenDrawing={isOpenDrawing}
        setOpenDrawing={setOpenDrawing}
        handleDrawingImageCapture={handleDrawingImageCapture}
      />

      <ImageEditDialog
        isOpenEditMode={isOpenEditMode}
        editImage={currentEditImage}
        handleCloseEditMode={handleCloseEditMode}
        handleSaveEditMode={handleSaveEditMode}
      />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        theme="colored"
      />
    </>
  );
};
