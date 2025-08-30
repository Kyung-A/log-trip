import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { PickerIOS } from '@react-native-picker/picker';
import { BottomSheetField, DateField } from '@/shared';
import { IRegion, useFetchRegions } from '@/entities/region';
import { CitySelectField } from '@/features/select-region';
import { Controller, useForm } from 'react-hook-form';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useFetchUserId } from '@/entities/auth';
import { ICompanionRequest, useCreateCompanion } from '@/entities/companion';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SNAP_POINTS = ['30%'];

export default function CompanionCreateScreen() {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      Home: NavigatorScreenParams<{ 내여행: undefined }>;
    }>
  >();
  const { showActionSheetWithOptions } = useActionSheet();

  const [cities, setCities] = useState<IRegion[]>([]);

  const { data: regions } = useFetchRegions();
  const { data: userId } = useFetchUserId();
  const { mutateAsync } = useCreateCompanion();

  const { control, watch, handleSubmit } = useForm({
    mode: 'onSubmit',
  });

  const handleCreateCompanion = handleSubmit(
    async (formData: ICompanionRequest) => {
      if (cities.length === 0) {
        Toast.show({
          type: 'error',
          text1: '도시 선택은 필수입니다.',
        });

        return;
      }

      const body = {
        ...formData,
        user_id: userId,
        companion_regions: cities.map(v => ({
          region_code: v.region_code,
          region_name: v.region_name,
          shape_name: v.shape_name,
          country_code: v.country_code,
          country_name: v.country_name,
        })),
      };

      const resp = await mutateAsync(body);
      console.log(resp);

      if (resp.status === 201) {
        // navigation.navigate('Home', {
        //   screen: '내여행',
        // });
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
        <Pressable className="pt-1.5" onPress={handleCreateCompanion}>
          <Text className="text-lg text-blue-500 underline">등록</Text>
        </Pressable>
      ),
    });
  }, [handleSubmit, handleCreateCompanion]);

  const handleOpenActionSheet = useCallback(onChange => {
    const options = ['무관', '남자', '여자'];

    showActionSheetWithOptions(
      {
        options,
      },
      idx => {
        if (idx === 0) onChange('R');
        else if (idx === 1) onChange('M');
        else if (idx === 2) onChange('F');
      },
    );
  }, []);

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <CitySelectField
          label="도시 선택"
          value={cities}
          onConfirm={setCities}
          options={regions}
        />

        <Controller
          control={control}
          name="companion_count"
          rules={{
            required: '동행수는 필수입니다.',
          }}
          render={({ field: { onChange, value } }) => (
            <BottomSheetField
              label="동행수"
              value={value}
              snapPoints={SNAP_POINTS}
            >
              <BottomSheetView>
                <PickerIOS
                  selectedValue={value}
                  onValueChange={itemValue => onChange(itemValue)}
                >
                  {Array.from({ length: 6 }, (_, i) => (
                    <PickerIOS.Item
                      key={i + 1}
                      label={String(i + 1)}
                      value={i + 1}
                    />
                  ))}
                </PickerIOS>
              </BottomSheetView>
            </BottomSheetField>
          )}
        />

        <Controller
          control={control}
          name="gender_preference"
          rules={{
            required: '성별은 필수입니다.',
          }}
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity
              onPress={() => handleOpenActionSheet(onChange)}
              className="flex-row justify-between w-full px-4 py-3 border-b border-gray-300"
            >
              <Text className="mr-4 text-lg">성별</Text>
              <Text className="text-lg text-gray-500">
                {value &&
                  (value === 'R' ? '무관' : value === 'M' ? '남자' : '여자')}
              </Text>
            </TouchableOpacity>
          )}
        />

        <Controller
          control={control}
          name="deadline_at"
          rules={{
            required: '모집 마감일은 필수입니다.',
          }}
          render={({ field: { onChange, value } }) => (
            <DateField
              defaultLabel="모집 마감일"
              valueLabel={value && dayjs(value).format('YYYY-MM-DD hh:mm')}
              onConfirm={date => onChange(date)}
              date={value}
              title="모집 마감일"
              minimumDate={new Date()}
            />
          )}
        />

        <Controller
          control={control}
          name="start_date"
          rules={{
            required: '동행 시작일은 필수입니다.',
          }}
          render={({ field: { onChange, value } }) => (
            <DateField
              defaultLabel="동행 시작"
              valueLabel={value && dayjs(value).format('YYYY-MM-DD hh:mm')}
              onConfirm={date => onChange(date)}
              date={value}
              title="동행 시작"
              minimumDate={new Date()}
            />
          )}
        />

        <Controller
          control={control}
          name="end_date"
          rules={{
            required: '동행 종료일은 필수입니다.',
          }}
          render={({ field: { onChange, value } }) => (
            <DateField
              defaultLabel="동행 종료"
              valueLabel={value && dayjs(value).format('YYYY-MM-DD hh:mm')}
              onConfirm={date => onChange(date)}
              date={value}
              title="동행 종료"
              minimumDate={watch('start_date')}
            />
          )}
        />

        <Controller
          control={control}
          name="place"
          render={({ field: { onChange } }) => (
            <View className="flex-row justify-between w-full px-4 py-3 border-b border-gray-300">
              <Text className="mr-4 text-lg">장소</Text>
              <TextInput
                className="text-lg leading-6 text-right text-gray-500 w-80"
                placeholder="구체적인 만남 장소"
                onChangeText={onChange}
              />
            </View>
          )}
        />

        <View className="p-4">
          <Controller
            control={control}
            name="title"
            rules={{
              required: '제목은 필수입니다.',
            }}
            render={({ field: { onChange } }) => (
              <TextInput
                className="text-xl font-semibold"
                placeholder="제목을 작성해주세요"
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="content"
            rules={{
              required: '내용은 필수입니다.',
            }}
            render={({ field: { onChange } }) => (
              <TextInput
                className="pb-20 mt-4 text-lg"
                placeholder="내용을 작성해주세요"
                multiline={true}
                textAlignVertical="top"
                onChangeText={onChange}
              />
            )}
          />
        </View>
      </ScrollView>
    </>
  );
}
