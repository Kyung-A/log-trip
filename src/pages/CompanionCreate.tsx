import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { getUser } from '@/entities/auth';
import dayjs from 'dayjs';
import { PickerIOS } from '@react-native-picker/picker';
import { BottomSheetField, DateField } from '@/shared';
import { IRegion, useFetchRegions } from '@/entities/region';
import { CitySelectField } from '@/features/select-region';
import { Controller, useForm } from 'react-hook-form';
import { useActionSheet } from '@expo/react-native-action-sheet';

const SNAP_POINTS = ['30%'];

export default function CompanionCreateScreen() {
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  const [formData, setFormData] = useState([]);
  const [cities, setCities] = useState<IRegion[]>([]);

  const { data: regions } = useFetchRegions();

  const { control, watch } = useForm();

  const getUserId = useCallback(async () => {
    const { id } = await getUser();
    setFormData(prev => ({ ...prev, user_id: id }));
  }, []);

  const handleSubmit = async () => {};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable className="pt-1.5" onPress={handleSubmit}>
          <Text className="text-lg text-blue-500 underline">등록</Text>
        </Pressable>
      ),
    });
  }, [formData]);

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

  useEffect(() => {
    getUserId();
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
          name="companion"
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
                  {Array.from({ length: 50 }, (_, i) => (
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
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity
              onPress={() => handleOpenActionSheet(onChange)}
              className="flex-row justify-between w-full px-4 py-3 border-b border-gray-300"
            >
              <Text className="mr-4 text-lg">성별</Text>
              <Text className="text-lg text-gray-500">
                {value === 'R' ? '무관' : value === 'M' ? '남자' : '여자'}
              </Text>
            </TouchableOpacity>
          )}
        />

        <Controller
          control={control}
          name="deadline_at"
          render={({ field: { onChange, value } }) => (
            <DateField
              defaultLabel="모집 마감일"
              valueLabel={value && dayjs(value).format('YYYY-MM-DD hh:mm')}
              onConfirm={date => onChange(date)}
              date={value}
              title="모집 마감일"
            />
          )}
        />

        <Controller
          control={control}
          name="start_date"
          render={({ field: { onChange, value } }) => (
            <DateField
              defaultLabel="동행 시작"
              valueLabel={value && dayjs(value).format('YYYY-MM-DD hh:mm')}
              onConfirm={date => onChange(date)}
              date={value}
              title="동행 시작"
            />
          )}
        />

        <Controller
          control={control}
          name="end_date"
          render={({ field: { onChange, value } }) => (
            <DateField
              defaultLabel="동행 종료"
              valueLabel={value && dayjs(value).format('YYYY-MM-DD hh:mm')}
              onConfirm={date => onChange(date)}
              date={value}
              title="동행 종료"
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
