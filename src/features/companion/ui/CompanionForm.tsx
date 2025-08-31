import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { PickerIOS } from '@react-native-picker/picker';
import { BottomSheetField, DateField } from '@/shared';
import { CitySelectField } from '@/features/select-region';
import { Controller, useFormContext } from 'react-hook-form';
import { IRegion, useFetchRegions } from '@/entities/region';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ICompanion } from '@/entities/companion';

interface IProps {
  cities: IRegion[];
  setCities: React.Dispatch<React.SetStateAction<IRegion[]>>;
  defaultValues?: ICompanion;
}

const SNAP_POINTS = ['30%'];

export default function CompanionForm({
  cities,
  setCities,
  defaultValues,
}: IProps) {
  const { showActionSheetWithOptions } = useActionSheet();
  const { data: regions } = useFetchRegions();
  const { control, watch, reset } = useFormContext();

  const handleOpenActionSheet = useCallback(
    (onChange: (...event: any[]) => void) => {
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
    },
    [],
  );

  useEffect(() => {
    if (defaultValues) {
      const {
        user_info,
        companion_regions,
        created_at,
        updated_at,
        deadline_at,
        start_date,
        end_date,
        ...rest
      } = defaultValues;

      setCities(companion_regions);

      reset({
        ...rest,
        deadline_at: dayjs(deadline_at).toDate(),
        start_date: dayjs(start_date).toDate(),
        end_date: dayjs(end_date).toDate(),
      });
    }
  }, [defaultValues, setCities]);

  return (
    <>
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
        render={({ field: { value, onChange } }) => (
          <View className="flex-row justify-between w-full px-4 py-3 border-b border-gray-300">
            <Text className="mr-4 text-lg">장소</Text>
            <TextInput
              className="text-lg leading-6 text-right text-gray-500 w-80"
              placeholder="구체적인 만남 장소"
              onChangeText={onChange}
              value={value}
              maxLength={20}
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
          render={({ field: { value, onChange } }) => (
            <TextInput
              className="text-xl font-semibold"
              placeholder="제목을 작성해주세요"
              onChangeText={onChange}
              maxLength={30}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="content"
          rules={{
            required: '내용은 필수입니다.',
          }}
          render={({ field: { value, onChange } }) => (
            <TextInput
              className="pb-20 mt-4 text-lg"
              placeholder="내용을 작성해주세요"
              multiline={true}
              textAlignVertical="top"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>
    </>
  );
}
