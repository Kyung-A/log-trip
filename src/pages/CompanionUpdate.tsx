import {
  ICompanionRequest,
  useFetchCompanionDetail,
  useUpdateCompanion,
} from '@/entities/companion';
import { IRegion } from '@/entities/region';
import { CompanionForm } from '@/features/companion';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text } from 'react-native';
import Toast from 'react-native-toast-message';

export default function CompanionUpdateScreen() {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      CompanionDetail: any;
    }>
  >();

  const {
    params: { id },
  } = useRoute<RouteProp<any>>();

  const { data } = useFetchCompanionDetail(id);
  const { mutateAsync } = useUpdateCompanion();
  const [cities, setCities] = useState<IRegion[]>([]);

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
        user_id: data.user_id,
        companion_regions: cities.map(v => ({
          region_code: v.region_code,
          region_name: v.region_name,
          shape_name: v.shape_name,
          country_code: v.country_code,
          country_name: v.country_name,
        })),
      };

      const resp = await mutateAsync(body);
      if (resp.status === 204) {
        navigation.navigate('CompanionDetail', {
          id: formData.id,
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
        <Pressable className="pt-1.5" onPress={handleCreateCompanion}>
          <Text className="text-lg text-blue-500 underline">수정</Text>
        </Pressable>
      ),
    });
  }, [methods.handleSubmit, handleCreateCompanion]);

  return (
    <FormProvider {...methods}>
      <ScrollView className="flex-1 bg-white">
        <CompanionForm
          cities={cities}
          setCities={setCities}
          defaultValues={data}
        />
      </ScrollView>
    </FormProvider>
  );
}
