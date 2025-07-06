import {
  Alert,
  Button,
  Dimensions,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  CountriesBottomSheet,
  Drawing,
  EditImage,
  UploadImages,
} from "@/features/Diary/ui";
import { ICountry } from "@/features/Diary/types";
import {
  Canvas,
  useCanvasRef,
  SkImage as SkImageType,
  Image as SkImage,
  SkPath,
  useImage,
} from "@shopify/react-native-skia";

export interface IColoredPath {
  path: SkPath;
  color: string;
}

export default function HomeScreen() {
  const contentCanvasRef = useCanvasRef();
  const editCanvasRef = useCanvasRef();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [imgs, setImgs] = useState<{ origin: string; uri: string }[]>([]);
  const [resultSelectedCountries, setResultSelectedCountries] = useState<
    ICountry[]
  >([]);
  const [isDrawingMode, setDrawingMode] = useState<boolean>(false);
  const [isOpenDrawing, setOpenDrawing] = useState<boolean>(false);
  const [isOpenEditMode, setOpenEditMode] = useState<boolean>(false);
  const [capturedDrawingImage, setCapturedDrawingImage] =
    useState<SkImageType | null>(null);

  const [frameImage, setFrameImage] = useState<string>();
  const frameImg = useImage(frameImage);
  const [currentEditImage, setCurrentEditImage] = useState<string>();
  const editImage = useImage(currentEditImage);

  const handleCaptureContent = useCallback(() => {
    const snapshot = contentCanvasRef.current?.makeImageSnapshot();
    if (snapshot) {
      setCapturedDrawingImage(snapshot);
    }
  }, [contentCanvasRef]);

  const handleCaptureEditImage = useCallback(() => {
    if (!currentEditImage) return;
    const snapshot = editCanvasRef.current?.makeImageSnapshot();
    if (!snapshot) return;

    const b64 = snapshot.encodeToBase64?.() ?? snapshot.encodeToBase64(3, 100);
    const newUri = `data:image/png;base64,${b64}`;

    setImgs((prev) =>
      prev.map((i) =>
        i.origin === currentEditImage ? { ...i, uri: newUri } : i
      )
    );
  }, [editCanvasRef, currentEditImage]);

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleChangeMode = useCallback((value) => {
    if (value) {
      Alert.alert(
        "드로잉 모드로 전환 하시겠습니까?",
        "드로잉 모드 전환시 작성한 텍스트는 사라집니다.",
        [
          {
            text: "예",
            onPress: () => {
              setDrawingMode(true);
              setOpenDrawing(true);
            },
          },
          { text: "취소", onPress: () => {}, style: "cancel" },
        ]
      );
    } else {
      Alert.alert(
        "텍스트 모드로 전환 하시겠습니까?",
        "텍스트 모드 전환시 작성한 그림은 사라집니다.",
        [
          {
            text: "예",
            onPress: () => {
              setDrawingMode(false);
              setCapturedDrawingImage(null);
            },
          },
          { text: "취소", onPress: () => {}, style: "cancel" },
        ]
      );
    }
  }, []);

  const handleCloseEditMode = () => {
    handleCaptureEditImage();
    setOpenEditMode(false);
    setFrameImage(null);
    setCurrentEditImage(null);
  };

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <UploadImages
          imgs={imgs}
          setImgs={setImgs}
          setOpenEditMode={setOpenEditMode}
          setCurrentEditImage={setCurrentEditImage}
        />

        <Pressable
          onPress={handleOpenPress}
          className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-t border-b border-gray-300"
        >
          <Text className="mr-4 text-xl">도시 선택</Text>
          <View className="flex flex-row flex-wrap flex-1 gap-2">
            {resultSelectedCountries.map((v) => (
              <Text className="p-2 rounded bg-[#ebebeb] font-semibold">
                {v.name}
              </Text>
            ))}
          </View>
        </Pressable>

        <Pressable className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300">
          <Text className="mr-4 text-xl">여행일</Text>
        </Pressable>

        <Pressable className="flex flex-row flex-wrap items-center justify-between w-full p-4 border-b border-gray-300">
          <Text className="mr-4 text-xl">드로잉 모드</Text>
          <View className="flex flex-row items-center gap-x-2">
            {isDrawingMode && (
              <Button onPress={() => setOpenDrawing(true)} title="열기" />
            )}
            <Switch value={isDrawingMode} onValueChange={handleChangeMode} />
          </View>
        </Pressable>

        {!isDrawingMode ? (
          <View className="p-4">
            <TextInput
              className="text-xl font-semibold"
              placeholder="제목을 작성해주세요"
            />
            <TextInput
              className="mt-4 text-lg"
              placeholder="내용을 작성해주세요"
            />
          </View>
        ) : (
          <Canvas
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height - 370,
            }}
          >
            <SkImage
              image={capturedDrawingImage}
              x={0}
              y={0}
              width={Dimensions.get("window").width}
              height={Dimensions.get("window").height - 370}
            />
          </Canvas>
        )}
      </ScrollView>

      <CountriesBottomSheet
        bottomSheetRef={bottomSheetRef}
        resultSelectedCountries={resultSelectedCountries}
        setResultSelectedCountries={setResultSelectedCountries}
      />

      <Drawing
        setOpenDrawing={setOpenDrawing}
        canvasRef={contentCanvasRef}
        isOpenDrawing={isOpenDrawing}
        handleCapture={handleCaptureContent}
      />

      {isOpenEditMode && (
        <EditImage
          canvasRef={editCanvasRef}
          editImage={editImage}
          frameImg={frameImg}
          setFrameImage={setFrameImage}
          handleCloseEditMode={handleCloseEditMode}
        />
      )}
    </>
  );
}
