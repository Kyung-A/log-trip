"use client";

import { useFetchUserId } from "@/features/auth";
import {
  IDiary,
  useCreateDiary,
  UploadImages,
  DrawingCanvasDialog,
  ImageEditDialog,
} from "@/features/diary";
import { IRegion, useFetchRegions } from "@/features/region";
import { CitySelectField, Switch } from "@/shared";
import dayjs from "dayjs";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const DEFAULT_FORM_VALUES = {
  user_id: "",
  title: null,
  text_content: null,
  drawing_content: null,
  is_drawing: false,
  travel_date: null,
  diary_images: [],
  diary_regions: [],
};

export default function CreateDiary() {
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

  const uploadAndGetUrlImage = async (file: string) => {
    // if (!file) return null;
    // const path = `diary-images/${userId}/${uuid.v4()}.jpg`;
    // let base64 = "";
    // if (file.startsWith("file://")) {
    //   base64 = await FileSystem.readAsStringAsync(file, {
    //     encoding: "base64",
    //   });
    // } else {
    //   base64 = file.includes(",") ? file.split(",")[1] : file;
    // }
    // const buffer = decode(base64);
    // await imageUpload("log-trip-images", path, buffer);
    // const result = await getImageUrl("log-trip-images", path);
    // return result.publicUrl;
  };

  const handleCreateDiary = handleSubmit(
    async (formData: IDiary) => {
      // if (cities.length === 0) {
      //   Toast.show({
      //     type: "error",
      //     text1: "도시 선택은 필수입니다.",
      //   });
      //   return;
      // }
      // let body = {
      //   ...formData,
      //   user_id: userId,
      //   diary_regions: cities.map((v) => ({
      //     region_code: v.region_code,
      //     region_name: v.region_name,
      //     shape_name: v.shape_name,
      //     country_code: v.country_code,
      //     country_name: v.country_name,
      //   })),
      // };
      // if (imgs && imgs.length > 0) {
      //   const diaryImagesUrls = await Promise.all(
      //     imgs.map((v) => uploadAndGetUrlImage(v.modified))
      //   );
      //   body = { ...body, diary_images: diaryImagesUrls };
      // }
      // if (formData.is_drawing) {
      //   const drawingContentBase64 = capturedDrawingImage.encodeToBase64();
      //   const drawingContentUrl = await uploadAndGetUrlImage(
      //     drawingContentBase64
      //   );
      //   body = { ...body, drawing_content: drawingContentUrl };
      // }
      // const result = await mutateAsync(body);
      // if (result) {
      //   // navigation.navigate('Home', {
      //   //   screen: '내여행',
      //   // });
      // }
    },
    (error) => {
      // Toast.show({
      //   type: "error",
      //   text1: Object.values(error)[0].message as string,
      // });
      // console.error(Object.values(error)[0].message);
    }
  );

  return (
    <>
      <UploadImages
        imgs={imgs}
        setImgs={setImgs}
        setOpenEditMode={setOpenEditMode}
        setCurrentEditImage={setCurrentEditImage}
      />

      <CitySelectField
        label="도시 선택"
        value={cities}
        onConfirm={setCities}
        options={regions}
      />

      <Controller
        control={control}
        name="travel_date"
        rules={{
          required: "여행일은 필수입니다.",
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <label className="flex flex-wrap items-start justify-between w-full px-4 py-3 border-b border-gray-300">
              <p className="mr-4 text-lg">여행일</p>
              <input
                type="date"
                value={value ?? ""}
                onChange={(date) => onChange(date)}
              />
            </label>
          </>
        )}
      />

      <div className="flex flex-wrap items-center justify-between w-full px-4 py-2 border-b border-gray-300">
        <p className="mr-4 text-lg">드로잉 모드</p>
        <div className="flex items-center gap-x-2">
          {watch("is_drawing") && (
            <button onClick={() => setOpenDrawing(true)} title="열기" />
          )}
          <Switch
            initialChecked={watch("is_drawing")}
            onToggle={(state) => handleChangeMode(state)}
          />
        </div>
      </div>

      {!watch("is_drawing") ? (
        <div className="p-4">
          <Controller
            control={control}
            name="title"
            rules={{
              ...(!watch("is_drawing") && { required: "제목은 필수입니다." }),
            }}
            render={({ field: { value, onChange } }) => (
              <input
                className="text-xl font-semibold w-full outline-0"
                placeholder="제목을 작성해주세요"
                onChange={onChange}
                value={value ?? ""}
              />
            )}
          />

          <Controller
            control={control}
            name="text_content"
            rules={{
              ...(!watch("is_drawing") && { required: "내용은 필수입니다." }),
            }}
            render={({ field: { value, onChange } }) => (
              <textarea
                className="pb-10 mt-4 text-lg min-h-56 w-full resize-none outline-0"
                placeholder="내용을 작성해주세요"
                onChange={onChange}
                value={value ?? ""}
              />
            )}
          />
        </div>
      ) : (
        capturedDrawingImage && (
          <Image
            src={capturedDrawingImage}
            width={canvasSize.width}
            height={canvasSize.height}
            className="w-full h-auto"
            sizes="100vw"
            alt="drawing image"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "auto",
            }}
          />
        )
      )}

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
    </>
  );
}
