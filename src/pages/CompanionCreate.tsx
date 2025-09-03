import { ScrollView, Text, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { IRegion } from '@/entities/region';
import { FormProvider, useForm } from 'react-hook-form';
import { useFetchUserId } from '@/entities/auth';
import { ICompanionRequest, useCreateCompanion } from '@/entities/companion';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompanionForm } from '@/features/companion';

export default function CompanionCreateScreen() {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      CompanionDetail: any;
    }>
  >();

  const [cities, setCities] = useState<IRegion[]>([]);

  const { data: userId } = useFetchUserId();
  const { mutateAsync } = useCreateCompanion();

  const methods = useForm({
    mode: 'onSubmit',
  });

  const handleCreateCompanion = methods.handleSubmit(
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
      if (resp.status === 201) {
        navigation.navigate('CompanionDetail', {
          id: resp.data.id,
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
        <TouchableOpacity className="pt-1.5" onPress={handleCreateCompanion}>
          <Text className="text-lg text-blue-500 underline">등록</Text>
        </TouchableOpacity>
      ),
    });
  }, [methods.handleSubmit, handleCreateCompanion]);

  return (
    <FormProvider {...methods}>
      <ScrollView className="flex-1 bg-white">
        <CompanionForm cities={cities} setCities={setCities} />
      </ScrollView>
    </FormProvider>
  );
}
