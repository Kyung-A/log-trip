import { Pressable, Text, TextInput, View } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IRegion } from '@/entities/region';

interface ICitySelectFieldProps {
  label: string;
  value: IRegion[];
  options: IRegion[];
  onConfirm: React.Dispatch<React.SetStateAction<IRegion[]>>;
}

const SNAP_POINTS = ['100%'];

export const CitySelectField = React.memo(
  ({ label, value, options, onConfirm }: ICitySelectFieldProps) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [search, setSearch] = useState<string>('');
    const [draft, setDraft] = useState<IRegion[]>([]);

    const handleOpen = useCallback(() => {
      bottomSheetRef.current?.present();
    }, []);

    const handleClose = useCallback(() => {
      bottomSheetRef.current.dismiss();
    }, []);

    const handleToggle = useCallback((item: IRegion) => {
      setDraft(prev => {
        const isSelected = prev?.some(data => data.id === item.id);

        if (isSelected) {
          return prev?.filter(p => !(p.id === item.id));
        } else {
          return [...prev, item];
        }
      });
    }, []);

    const handleConfirm = useCallback(() => {
      onConfirm(draft);
      handleClose();
    }, [draft, handleClose, onConfirm]);

    const filteredList = useMemo(() => {
      return options?.filter(
        v => v.region_name.includes(search) || v.country_name.includes(search),
      );
    }, [options, search]);

    useEffect(() => {
      setDraft(value);
    }, [value]);

    return (
      <>
        <Pressable
          onPress={handleOpen}
          className="flex-row flex-wrap items-start justify-between w-full px-4 py-3 border-t border-b border-gray-300"
        >
          <Text className="mr-4 text-lg pt-0.5">{label}</Text>
          <View className="flex-row flex-wrap flex-1 gap-2">
            {value?.map(v => (
              <Text
                key={v.region_code}
                className="p-2 rounded bg-[#ebebeb] font-semibold"
              >
                {v.region_name}
              </Text>
            ))}
          </View>
        </Pressable>

        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={SNAP_POINTS}
          index={0}
          enablePanDownToClose={true}
          enableDynamicSizing={false}
          backdropComponent={props => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
            />
          )}
        >
          <BottomSheetFlatList
            data={filteredList}
            ListHeaderComponent={
              <View className="px-6 pb-4 bg-white border-b border-[#ebebeb]">
                <View className="flex-row items-center justify-between w-full pt-12">
                  <Pressable onPress={handleClose}>
                    <Ionicons name="close-outline" size={32} color="#000" />
                  </Pressable>
                  <Text className="text-xl font-semibold">도시 선택</Text>
                  <Pressable onPress={handleConfirm}>
                    <Text className="text-xl text-blue-500 underline ">
                      완료
                    </Text>
                  </Pressable>
                </View>

                <View className="flex-row items-center px-3 py-4 mt-6 rounded-lg bg-[#ebebeb]">
                  <Ionicons name="search-outline" size={24} />
                  <TextInput
                    className="ml-3 text-lg"
                    placeholder="도시 또는 나라 검색"
                    onChangeText={setSearch}
                  />
                </View>

                <View className="flex-row flex-wrap gap-2 mt-4">
                  {draft?.map(v => (
                    <Text
                      key={v.region_name}
                      className="p-2 rounded bg-[#ebebeb] font-semibold"
                    >
                      {v.region_name}
                    </Text>
                  ))}
                </View>
              </View>
            }
            stickyHeaderIndices={[0]}
            renderItem={({ item }) => {
              const selected = draft?.some(v => item.id === v.id);

              return (
                <Pressable
                  onPress={() => handleToggle(item)}
                  className="flex-row items-center px-6 py-3 border-b border-gray-100 gap-x-2"
                >
                  <MaterialCommunityIcons
                    name={
                      selected ? 'checkbox-marked' : 'checkbox-blank-outline'
                    }
                    size={28}
                    color={selected ? '#000' : '#ccc'}
                  />
                  <View>
                    <Text className="text-xl">{item.region_name}</Text>
                    <Text className="mt-0.5 text-base text-gray-600">
                      {item.country_name}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
            initialNumToRender={20}
            windowSize={10}
            removeClippedSubviews
            getItemLayout={(_, index) => ({
              length: 56,
              offset: 56 * index,
              index,
            })}
          />
        </BottomSheetModal>
      </>
    );
  },
);
