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
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  CountriesBottomSheet,
  Drawing,
  EditImage,
  UploadImages,
} from "@/features/diary/ui";
import { ICountry } from "@/features/diary/types";
import {
  Canvas,
  useCanvasRef,
  SkImage as SkImageType,
  Image as SkImage,
  SkPath,
  useImage,
} from "@shopify/react-native-skia";
import DatePicker from "react-native-date-picker";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import uuid from "react-native-uuid";
import { getUser } from "@/entities/auth";
import { createDiary } from "@/entities/diary";
import { IDiary } from "@/entities/diary/types";
import { imageUpload, getImageUrl } from "@/shared";

export interface IColoredPath {
  path: SkPath;
  color: string;
}

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

export default function DiaryCreateScreen() {
  const navigation = useNavigation();
  const contentCanvasRef = useCanvasRef();
  const editCanvasRef = useCanvasRef();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [formData, setFormData] = useState<IDiary>(DEFAULT_FORM_VALUES);
  const [isShowTopBar, setShowTopBar] = useState<boolean>(true);

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

  const [date, setDate] = useState(new Date());
  const [openDateModal, setOpenDateModal] = useState(false);

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
    setShowTopBar(false);
    bottomSheetRef.current?.expand();
  }, []);

  const handleChangeMode = useCallback((value: boolean) => {
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
              setShowTopBar(false);
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
              setShowTopBar(true);
            },
          },
          { text: "취소", onPress: () => {}, style: "cancel" },
        ]
      );
    }

    handleChangeFormValues("is_drawing", value);
  }, []);

  const handleCloseEditMode = useCallback(() => {
    setOpenEditMode(false);
    setShowTopBar(true);
    setFrameImage(null);
    setCurrentEditImage(null);
  }, [setOpenEditMode, setFrameImage, setCurrentEditImage]);

  const handleSaveEditMode = useCallback(() => {
    handleCaptureEditImage();
    setOpenEditMode(false);
    setShowTopBar(true);
    setFrameImage(null);
    setCurrentEditImage(null);
  }, [
    handleCaptureEditImage,
    setOpenEditMode,
    setFrameImage,
    setCurrentEditImage,
  ]);

  const handleChangeFormValues = useCallback((key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const uploadAndGetUrlImage = async (file: string) => {
    if (!file) return null;

    const path = `diary-images/${formData.user_id}/${uuid.v4()}.jpg`;
    let base64 = "";

    if (file.startsWith("file://")) {
      base64 = await FileSystem.readAsStringAsync(file, {
        encoding: "base64",
      });
    } else {
      base64 = file.includes(",") ? file.split(",")[1] : file;
    }

    const buffer = decode(base64);

    await imageUpload("log-trip-images", path, buffer);
    const result = await getImageUrl("log-trip-images", path);

    return result.publicUrl;
  };

  const getUserId = useCallback(async () => {
    const { id } = await getUser();
    setFormData((prev) => ({ ...prev, user_id: id }));
  }, []);

  const handleSubmit = async () => {
    if (formData.is_drawing) {
      if (
        !capturedDrawingImage ||
        formData.diary_regions.length === 0 ||
        !formData.travel_date
      ) {
        console.error("필수값 누락");
        return;
      }
    } else {
      if (
        !formData.title ||
        !formData.text_content ||
        !formData.travel_date ||
        formData.diary_regions.length === 0
      ) {
        console.error("필수값 누락");
        return;
      }
    }

    let body = {
      ...formData,
    };

    if (imgs && imgs.length > 0) {
      const diaryImagesUrls = await Promise.all(
        imgs.map((v) => uploadAndGetUrlImage(v.uri))
      );
      body = { ...body, diary_images: diaryImagesUrls };
    }

    if (formData.is_drawing) {
      const drawingContentBase64 = capturedDrawingImage.encodeToBase64();
      const drawingContentUrl =
        await uploadAndGetUrlImage(drawingContentBase64);

      body = { ...body, drawing_content: drawingContentUrl };
    }

    const result = await createDiary(body);
    if (result) {
      navigation.navigate("Home", {
        screen: "내여행",
      });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable className="pt-1.5" onPress={handleSubmit}>
          <Text className="text-lg text-blue-500 underline">등록</Text>
        </Pressable>
      ),
    });
  }, [formData, imgs, capturedDrawingImage]);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: isShowTopBar });
  }, [navigation, isShowTopBar]);

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <UploadImages
          imgs={imgs}
          setImgs={setImgs}
          setShowTopBar={setShowTopBar}
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
              <Text
                key={v.code}
                className="p-2 rounded bg-[#ebebeb] font-semibold"
              >
                {v.name}
              </Text>
            ))}
          </View>
        </Pressable>

        <Pressable
          onPress={() => setOpenDateModal(true)}
          className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
        >
          <Text className="mr-4 text-xl">
            {dayjs(date).format("YYYY-MM-DD") ?? "여행일"}
          </Text>
          <DatePicker
            modal
            mode="date"
            open={openDateModal}
            date={date}
            locale="ko-KR"
            onConfirm={(date) => {
              setOpenDateModal(false);
              setDate(date);
              handleChangeFormValues("travel_date", date);
            }}
            onCancel={() => {
              setOpenDateModal(false);
            }}
          />
        </Pressable>

        <Pressable className="flex flex-row flex-wrap items-center justify-between w-full p-4 border-b border-gray-300">
          <Text className="mr-4 text-xl">드로잉 모드</Text>
          <View className="flex flex-row items-center gap-x-2">
            {isDrawingMode && (
              <Button
                onPress={() => {
                  setOpenDrawing(true);
                  setShowTopBar(false);
                }}
                title="열기"
              />
            )}
            <Switch value={isDrawingMode} onValueChange={handleChangeMode} />
          </View>
        </Pressable>

        {!isDrawingMode ? (
          <View className="p-4">
            <TextInput
              className="text-xl font-semibold"
              placeholder="제목을 작성해주세요"
              onChangeText={(value) => handleChangeFormValues("title", value)}
            />
            <TextInput
              className="pb-20 mt-4 text-lg"
              placeholder="내용을 작성해주세요"
              multiline={true}
              textAlignVertical="top"
              onChangeText={(value) =>
                handleChangeFormValues("text_content", value)
              }
            />
          </View>
        ) : (
          <Canvas
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height - 220,
            }}
          >
            <SkImage
              image={capturedDrawingImage}
              x={0}
              y={0}
              width={Dimensions.get("window").width}
              height={Dimensions.get("window").height - 220}
            />
          </Canvas>
        )}
      </ScrollView>

      <CountriesBottomSheet
        bottomSheetRef={bottomSheetRef}
        resultSelectedCountries={resultSelectedCountries}
        setResultSelectedCountries={setResultSelectedCountries}
        handleChangeFormValues={handleChangeFormValues}
        setShowTopBar={setShowTopBar}
      />

      <Drawing
        setOpenDrawing={setOpenDrawing}
        canvasRef={contentCanvasRef}
        isOpenDrawing={isOpenDrawing}
        handleCapture={handleCaptureContent}
        setShowTopBar={setShowTopBar}
      />

      {isOpenEditMode && (
        <EditImage
          canvasRef={editCanvasRef}
          editImage={editImage}
          frameImg={frameImg}
          setFrameImage={setFrameImage}
          handleCloseEditMode={handleCloseEditMode}
          handleSaveEditMode={handleSaveEditMode}
        />
      )}
    </>
  );
}
