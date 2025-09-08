import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Pressable, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-web-swiper';
import { Canvas, useImage, Image as SkImage } from '@shopify/react-native-skia';

const SIZE = 350;

const Slide = ({ uri }: { uri: string }) => {
  if (!uri) return null;
  const img = useImage(uri);
  if (!img) return;

  return (
    <Canvas
      style={{
        width: SIZE,
        height: SIZE,
        alignSelf: 'center',
      }}
    >
      <SkImage image={img} x={0} y={0} width={SIZE} height={SIZE} fit="cover" />
    </Canvas>
  );
};

interface IUploadImagesProps {
  imgs: { origin: string; uri: string }[];
  setImgs: React.Dispatch<
    React.SetStateAction<{ origin: string; uri: string }[]>
  >;
  setShowTopBar: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentEditImage: React.Dispatch<React.SetStateAction<string>>;
}

export default function UploadImages({
  imgs,
  setImgs,
  setShowTopBar,
  setOpenEditMode,
  setCurrentEditImage,
}: IUploadImagesProps) {
  const { showActionSheetWithOptions } = useActionSheet();

  const handleDeleted = useCallback(
    (origin: string) => setImgs(prev => prev.filter(i => i.origin !== origin)),
    [],
  );

  const handleResult = useCallback((res: ImagePicker.ImagePickerResult) => {
    if (!res.canceled) {
      setImgs(res.assets.map(a => ({ origin: a.uri, uri: a.uri })));
    }
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
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      alert('카메라 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      handleResult(result);
    }
  }, []);

  const onPress = useCallback(() => {
    const options = ['카메라 촬영', '앨범에서 선택', '취소'];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      },
      idx => {
        if (idx === 0) takeWithCamera();
        else if (idx === 1) pickFromLibrary();
        else if (idx === 2) return;
      },
    );
  }, []);

  return (
    <>
      {imgs.length === 0 && (
        <Pressable
          onPress={onPress}
          className="flex flex-row items-center justify-center w-full py-2 bg-[#f2eeec] gap-x-2"
        >
          <FontAwesome5 name="image" size={20} color="#a38f86" />
          <Text className="text-[#a38f86] font-semibold">사진 추가하기</Text>
        </Pressable>
      )}
      <View className="w-full h-[350px]">
        {imgs && imgs.length > 0 ? (
          <Swiper
            key={imgs.map(i => i.uri).join('|')}
            loop
            containerStyle={{ width: '100%', height: '100%', zIndex: 20 }}
            controlsProps={{
              prevPos: false,
              nextPos: false,
              dotsTouchable: true,
              dotsPos: 'bottom',
              dotActiveStyle: { backgroundColor: '#d5b2a7' },
            }}
          >
            {imgs.map(img => (
              <Pressable
                key={img.origin}
                onPress={() => {
                  setOpenEditMode(true);
                  setCurrentEditImage(img.origin);
                  setShowTopBar(false);
                }}
                className="items-center justify-center flex-1"
              >
                <Slide uri={img.uri} />

                <Pressable
                  onPress={() => handleDeleted(img.origin)}
                  className="absolute right-2 top-3 border-2 rounded-full border-white bg-[#00000099]"
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </Pressable>
              </Pressable>
            ))}
          </Swiper>
        ) : (
          <View className="flex-col items-center justify-center w-full h-full">
            <FontAwesome5 name="images" size={120} color="#f2eeec" />
          </View>
        )}
      </View>
    </>
  );
}
