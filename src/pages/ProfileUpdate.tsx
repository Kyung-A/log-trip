import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Controller, useForm } from 'react-hook-form';
import { getImageUrl, imageUpload } from '@/shared/api';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/shared';
import { useQueryClient } from '@tanstack/react-query';

interface IProfile {
  id: string;
  profile_image: string;
  nickname: string;
  about: string;
}

export default function ProfileUpdateScreen({}) {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();
  const route = useRoute();
  const qc = useQueryClient();

  const profile = useMemo(() => route.params as IProfile, [route]);
  const [profileImg, setProfileImg] = useState<string>();

  const { control, handleSubmit } = useForm({ defaultValues: profile });

  const handleDeleted = useCallback(() => setProfileImg(null), []);

  const handleResult = useCallback((res: ImagePicker.ImagePickerResult) => {
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setProfileImg(res.assets[0].uri);
    }
  }, []);

  const pickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 1,
      quality: 0.8,
    });
    handleResult(result);
  }, []);

  const takeWithCamera = useCallback(async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    handleResult(result);
  }, []);

  const onPress = useCallback(() => {
    const options = ['카메라 촬영', '앨범에서 선택', '삭제', '취소'];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 3,
        destructiveButtonIndex: 2,
      },
      idx => {
        if (idx === 0) takeWithCamera();
        else if (idx === 1) pickFromLibrary();
        else if (idx === 2) handleDeleted();
        else if (idx === 3) return;
      },
    );
  }, []);

  const uploadAndGetUrlImage = async () => {
    if (!profileImg || !profileImg.startsWith('file://')) {
      return null;
    }

    const path = `profiles/${profile.id}/profile-image.jpg`;
    const base64 = await FileSystem.readAsStringAsync(profileImg, {
      encoding: 'base64',
    });
    const buffer = decode(base64);

    await supabase.storage.from('log-trip-images').remove([path]);
    await imageUpload('log-trip-images', path, buffer);
    const result = await getImageUrl('log-trip-images', path);

    return result.publicUrl;
  };

  const handleSaveProfile = async formData => {
    try {
      const imageUrl = profileImg?.includes('https://')
        ? profileImg
        : await uploadAndGetUrlImage();

      const data = {
        ...formData,
        profile_image: imageUrl,
      };

      const response = await supabase
        .from('users')
        .update(data)
        .eq('id', profile.id)
        .select();

      if (response.status === 200) {
        qc.invalidateQueries({
          queryKey: ['profile'],
          refetchType: 'active',
          exact: true,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setProfileImg(profile.profile_image);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          className="pt-1.5"
          onPress={() => handleSubmit(handleSaveProfile)()}
        >
          <Text className="text-lg text-blue-500 underline">저장</Text>
        </TouchableOpacity>
      ),
    });
  }, [profileImg]);

  return (
    <View className="items-center flex-1 bg-white">
      <View className="relative w-32 h-32 mt-20 bg-[#d5b2a7] rounded-full">
        {profileImg ? (
          <Image
            source={{ uri: profileImg }}
            className="object-cover w-full h-full rounded-full"
          />
        ) : (
          <View className="items-center justify-center w-full h-full">
            <Ionicons name="person" size={60} color="#fff" />
          </View>
        )}

        <Pressable
          onPress={onPress}
          className="absolute right-0 bg-[#cdc6c3] rounded-full w-10 h-10 items-center justify-center"
        >
          <FontAwesome name="camera" size={18} color="#fff" />
        </Pressable>
      </View>
      <Controller
        control={control}
        name="nickname"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="w-40 mt-4 text-xl font-semibold text-center"
            placeholder="이름을 작성해주세요"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="about"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="w-64 mt-3 text-center"
            placeholder="소개를 작성해주세요"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
    </View>
  );
}
