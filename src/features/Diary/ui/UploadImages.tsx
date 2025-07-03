import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-web-swiper";
import {
  Canvas,
  SkImage as SkImageType,
  Image as SkImage,
  useCanvasRef,
  useImage,
} from "@shopify/react-native-skia";

const FRAMES = {
  frame1: require("../../../../assets/frame/frame1.png"),
  frame2: require("../../../../assets/frame/frame2.png"),
  frame3: require("../../../../assets/frame/frame3.png"),
};

interface IUploadImagesProps {
  imgs: string[];
  setImgs: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function UploadImages({ imgs, setImgs }: IUploadImagesProps) {
  const canvasRef = useCanvasRef();
  const { showActionSheetWithOptions } = useActionSheet();
  const [isOpenEditMode, setOpenEditMode] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<SkImageType>();

  const [frameImage, setFrameImage] = useState<string>();
  const frameImg = useImage(frameImage);

  const [currentEditImage, setCurrentEditImage] = useState<string>();
  const editImage = useImage(currentEditImage);

  const handleDeleted = useCallback(
    (uri: string) => {
      const newValue = imgs.filter((v) => v !== uri);
      setImgs(newValue);
    },
    [imgs]
  );

  const handleResult = useCallback((res: ImagePicker.ImagePickerResult) => {
    if (!res.canceled) setImgs(res.assets.map((v) => v.uri));
  }, []);

  const pickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    handleResult(result);
  }, []);

  const takeWithCamera = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    handleResult(result);
  }, []);

  const onPress = useCallback(() => {
    const options = ["카메라 촬영", "앨범에서 선택", "취소"];

    showActionSheetWithOptions(
      {
        options,
      },
      (idx) => {
        if (idx === 0) takeWithCamera();
        else if (idx === 1) pickFromLibrary();
        else if (idx === 2) return;
      }
    );
  }, []);

  const handleCapture = useCallback(() => {
    const snapshot = canvasRef.current?.makeImageSnapshot();
    if (snapshot) {
      setCapturedImage(snapshot);
    }
  }, [canvasRef]);

  // console.log(frameImg);

  return (
    <>
      <Pressable
        onPress={onPress}
        className="flex flex-row items-center justify-center w-full py-2 bg-gray-200 gap-x-2"
      >
        <EvilIcons name="camera" size={30} color="#4b5563" />
        <Text className="text-[#4b5563]">사진 추가하기</Text>
      </Pressable>
      <View className="w-full h-[250px]">
        {imgs && imgs.length > 0 ? (
          <Swiper
            key={imgs?.join("|")}
            loop
            containerStyle={{ width: "100%", height: "100%" }}
          >
            {imgs?.map((uri) => (
              <Pressable
                onPress={() => {
                  setOpenEditMode(true);
                  setCurrentEditImage(uri);
                }}
                key={uri}
                className="w-full h-full"
              >
                <Image
                  source={{ uri }}
                  className="object-contain w-full h-full"
                />
                <Pressable
                  onPress={() => handleDeleted(uri)}
                  className="right-2 top-3 border-2 rounded-full border-white bg-[#00000099] absolute"
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </Pressable>
              </Pressable>
            ))}
          </Swiper>
        ) : (
          <View className="w-full h-full flex items-center justify-center flex-col bg-[#00000043]">
            <Text className="text-lg">사진을 등록해 주세요!</Text>
          </View>
        )}
      </View>

      {isOpenEditMode && (
        <View className="absolute top-0 left-0 z-10 flex-1 w-full h-screen bg-black">
          <Pressable
            onPress={() => {
              setOpenEditMode(false);
              handleCapture();
            }}
            className="absolute top-0 left-0 w-16 h-16"
          >
            <Ionicons name="close" size={30} color="#fff" />
          </Pressable>

          <View className="flex flex-col items-center w-full h-full bg-red-300 gap-y-20">
            <Canvas
              pointerEvents="none"
              style={{
                width: 350,
                height: 350,
                overflow: "hidden",
              }}
              ref={canvasRef}
            >
              <SkImage
                image={editImage}
                x={0}
                y={0}
                width={350}
                height={350}
                fit="cover"
              />
              <SkImage
                image={frameImg}
                x={0}
                y={0}
                width={350}
                height={350}
                fit="cover"
              />
            </Canvas>

            <View className="flex flex-row items-center gap-x-3">
              {Object.entries(FRAMES).map(([key, value]) => (
                <Pressable
                  onPress={() => {
                    setFrameImage(value);
                    console.log("22222", "이미지11");
                  }}
                  key={key}
                  className="block w-20 h-20"
                >
                  <Image source={value} className="w-full h-full object-fit" />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}
    </>
  );
}
