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
  TouchableOpacity,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Drawing, EditImage, UploadImages } from '@/features/diary/ui';
import {
  Canvas,
  useCanvasRef,
  SkImage as SkImageType,
  Image as SkImage,
  SkPath,
  useImage,
} from '@shopify/react-native-skia';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import uuid from 'react-native-uuid';
import { useFetchUserId } from '@/entities/auth';
import { IDiary } from '@/entities/diary/model/types';
import { imageUpload, getImageUrl, DateField } from '@/shared';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IRegion, useFetchRegions } from '@/entities/region';
import { CitySelectField } from '@/features/select-region';
import { useCreateDiary } from '@/entities/diary';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export interface IColoredPath {
  path: SkPath;
  color: string;
}

const DEFAULT_FORM_VALUES = {
  user_id: '',
  title: null,
  text_content: null,
  drawing_content: null,
  is_drawing: false,
  travel_date: null,
  diary_images: [],
  diary_regions: [],
};

export default function DiaryCreateScreen() {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      Home: NavigatorScreenParams<{ 내여행: undefined }>;
    }>
  >();
  const contentCanvasRef = useCanvasRef();
  const editCanvasRef = useCanvasRef();

  const [cities, setCities] = useState<IRegion[]>([]);
  const [isShowTopBar, setShowTopBar] = useState<boolean>(true);

  const [imgs, setImgs] = useState<{ origin: string; uri: string }[]>([]);
  const [isOpenDrawing, setOpenDrawing] = useState<boolean>(false);
  const [isOpenEditMode, setOpenEditMode] = useState<boolean>(false);
  const [capturedDrawingImage, setCapturedDrawingImage] =
    useState<SkImageType | null>(null);

  const [frameImage, setFrameImage] = useState<string>();
  const frameImg = useImage(frameImage);
  const [currentEditImage, setCurrentEditImage] = useState<string>();
  const editImage = useImage(currentEditImage);

  const { data: userId } = useFetchUserId();
  const { data: regions } = useFetchRegions();
  const { mutateAsync } = useCreateDiary();

  const { control, watch, setValue, handleSubmit } = useForm<IDiary>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

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

    setImgs(prev =>
      prev.map(i =>
        i.origin === currentEditImage ? { ...i, uri: newUri } : i,
      ),
    );
  }, [editCanvasRef, currentEditImage]);

  const handleChangeMode = useCallback((value: boolean) => {
    if (value) {
      Alert.alert(
        '드로잉 모드로 전환 하시겠습니까?',
        '드로잉 모드 전환시 작성한 텍스트는 사라집니다.',
        [
          {
            text: '예',
            onPress: () => {
              setValue('is_drawing', true);
              setOpenDrawing(true);
              setShowTopBar(false);
            },
          },
          { text: '취소', onPress: () => {}, style: 'cancel' },
        ],
      );
    } else {
      Alert.alert(
        '텍스트 모드로 전환 하시겠습니까?',
        '텍스트 모드 전환시 작성한 그림은 사라집니다.',
        [
          {
            text: '예',
            onPress: () => {
              setValue('is_drawing', false);
              setCapturedDrawingImage(null);
              setShowTopBar(true);
            },
          },
          { text: '취소', onPress: () => {}, style: 'cancel' },
        ],
      );
    }
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

  const uploadAndGetUrlImage = async (file: string) => {
    if (!file) return null;

    const path = `diary-images/${userId}/${uuid.v4()}.jpg`;
    let base64 = '';

    if (file.startsWith('file://')) {
      base64 = await FileSystem.readAsStringAsync(file, {
        encoding: 'base64',
      });
    } else {
      base64 = file.includes(',') ? file.split(',')[1] : file;
    }

    const buffer = decode(base64);

    await imageUpload('log-trip-images', path, buffer);
    const result = await getImageUrl('log-trip-images', path);

    return result.publicUrl;
  };

  const handleCreateDiary = handleSubmit(
    async (formData: IDiary) => {
      if (cities.length === 0) {
        Toast.show({
          type: 'error',
          text1: '도시 선택은 필수입니다.',
        });

        return;
      }

      let body = {
        ...formData,
        user_id: userId,
        diary_regions: cities.map(v => ({
          region_code: v.region_code,
          region_name: v.region_name,
          shape_name: v.shape_name,
          country_code: v.country_code,
          country_name: v.country_name,
        })),
      };

      if (imgs && imgs.length > 0) {
        const diaryImagesUrls = await Promise.all(
          imgs.map(v => uploadAndGetUrlImage(v.uri)),
        );
        body = { ...body, diary_images: diaryImagesUrls };
      }

      if (formData.is_drawing) {
        const drawingContentBase64 = capturedDrawingImage.encodeToBase64();
        const drawingContentUrl =
          await uploadAndGetUrlImage(drawingContentBase64);

        body = { ...body, drawing_content: drawingContentUrl };
      }

      const result = await mutateAsync(body);
      if (result) {
        navigation.navigate('Home', {
          screen: '내여행',
        });
      }
    },
    error => {
      Toast.show({
        type: 'error',
        text1: Object.values(error)[0].message as string,
      });
      console.error(Object.values(error)[0].message);
    },
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity className="pt-1.5" onPress={handleCreateDiary}>
          <Text className="text-lg text-blue-500 underline">등록</Text>
        </TouchableOpacity>
      ),
    });
  }, [imgs, cities, capturedDrawingImage, userId]);

  useEffect(() => {
    navigation.setOptions({ headerShown: isShowTopBar });
  }, [navigation, isShowTopBar]);

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraScrollHeight={20}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1">
        <UploadImages
          imgs={imgs}
          setImgs={setImgs}
          setShowTopBar={setShowTopBar}
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
            required: '여행일은 필수입니다.',
          }}
          render={({ field: { onChange, value } }) => (
            <DateField
              defaultLabel="여행일"
              valueLabel={value && dayjs(value).format('YYYY-MM-DD')}
              onConfirm={date => onChange(date)}
              date={value || new Date()}
              title="여행일"
              mode="date"
            />
          )}
        />

        <Pressable className="flex-row flex-wrap items-center justify-between w-full px-4 py-2 border-b border-gray-300">
          <Text className="mr-4 text-lg">드로잉 모드</Text>
          <View className="flex-row items-center gap-x-2">
            {watch('is_drawing') && (
              <Button
                onPress={() => {
                  setOpenDrawing(true);
                  setShowTopBar(false);
                }}
                title="열기"
              />
            )}
            <Switch
              value={watch('is_drawing')}
              onValueChange={handleChangeMode}
            />
          </View>
        </Pressable>

        {!watch('is_drawing') ? (
          <View className="p-4">
            <Controller
              control={control}
              name="title"
              rules={{
                ...(!watch('is_drawing') && { required: '제목은 필수입니다.' }),
              }}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  className="text-xl font-semibold"
                  placeholder="제목을 작성해주세요"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="text_content"
              rules={{
                ...(!watch('is_drawing') && { required: '내용은 필수입니다.' }),
              }}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  className="pb-10 mt-4 text-lg min-h-44"
                  placeholder="내용을 작성해주세요"
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
        ) : (
          <Canvas
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height - 220,
            }}
          >
            <SkImage
              image={capturedDrawingImage}
              x={0}
              y={0}
              width={Dimensions.get('window').width}
              height={Dimensions.get('window').height - 220}
            />
          </Canvas>
        )}
      </ScrollView>

      <Drawing
        setOpenDrawing={setOpenDrawing}
        canvasRef={contentCanvasRef}
        isOpenDrawing={isOpenDrawing}
        handleCapture={handleCaptureContent}
        setShowTopBar={setShowTopBar}
      />

      <EditImage
        isOpenEditMode={isOpenEditMode}
        canvasRef={editCanvasRef}
        editImage={editImage}
        frameImg={frameImg}
        setFrameImage={setFrameImage}
        handleCloseEditMode={handleCloseEditMode}
        handleSaveEditMode={handleSaveEditMode}
      />
    </KeyboardAwareScrollView>
  );
}
