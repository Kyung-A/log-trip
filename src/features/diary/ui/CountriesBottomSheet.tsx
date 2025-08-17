import { Button, Pressable, Text, TextInput, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { getRegions } from "@/shared";
import { IRegion } from "@/shared/types";

const SNAP_POINTS = ["100%"];

interface ICountriesBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  resultSelectedCountries: IRegion[];
  setResultSelectedCountries: React.Dispatch<React.SetStateAction<IRegion[]>>;
  handleChangeFormValues: (key: string, value: any) => void;
  setShowTopBar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CountriesBottomSheet({
  bottomSheetRef,
  resultSelectedCountries,
  setResultSelectedCountries,
  handleChangeFormValues,
  setShowTopBar,
}: ICountriesBottomSheetProps) {
  const [selectedCountries, setSelectedCountries] = useState<IRegion[]>([]);
  const [searchCountries, setSearchCountries] = useState<IRegion[]>();
  const allCountries = useRef<IRegion[]>(null);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setShowTopBar(true);
        setSelectedCountries(resultSelectedCountries);
      }
    },
    [resultSelectedCountries]
  );

  const handleSelectedCountry = useCallback((selectData: IRegion) => {
    setSelectedCountries((prev) => {
      const isSelected = prev.some(
        (data) =>
          data.region_code === selectData.region_code &&
          data.country_code === selectData.country_code
      );

      if (isSelected) {
        return prev.filter(
          (p) =>
            !(
              p.region_code === selectData.region_code &&
              p.country_code === selectData.country_code
            )
        );
      } else {
        return [...prev, selectData];
      }
    });
  }, []);

  const handleSearchCountry = useCallback((value) => {
    const newList = allCountries.current.filter(
      (v) => v.region_name.includes(value) || v.country_name.includes(value)
    );
    setSearchCountries(newList);
  }, []);

  const handleSelectedFinish = useCallback(() => {
    bottomSheetRef.current.close();
    setShowTopBar(true);
    setResultSelectedCountries(selectedCountries);
    handleChangeFormValues(
      "diary_regions",
      selectedCountries.map((v) => ({
        region_code: v.region_code,
        region_name: v.region_name,
        shape_name: v.shape_name,
        country_code: v.country_code,
        country_name: v.country_name,
      }))
    );
  }, [selectedCountries]);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current.close();
    setShowTopBar(true);
    setSelectedCountries(resultSelectedCountries);
  }, [resultSelectedCountries]);

  const fetchRegions = useCallback(async () => {
    const { data } = await getRegions();
    setSearchCountries(data);
    allCountries.current = data;
  }, []);

  useEffect(() => {
    fetchRegions();
  }, []);

  return (
    <BottomSheet
      index={-1}
      snapPoints={SNAP_POINTS}
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
    >
      <BottomSheetScrollView
        stickyHeaderIndices={[0]}
        className="flex-1 bg-white"
      >
        <View className="sticky top-0 h-auto px-6 pb-4 bg-white border-b border-[#ebebeb]">
          <View className="flex flex-row items-center justify-between w-full pt-12">
            <Pressable onPress={handleCloseBottomSheet}>
              <Ionicons name="close-outline" size={32} color="#000" />
            </Pressable>
            <Text className="text-xl font-semibold">도시 선택</Text>
            <Button onPress={handleSelectedFinish} title="완료" />
          </View>
          <View className="flex flex-row items-center px-3 py-4 mt-6 rounded-lg bg-[#ebebeb]">
            <Ionicons name="search-outline" size={24} />
            <TextInput
              className="ml-3 text-lg"
              textContentType="addressCity"
              placeholder="도시 또는 나라 검색"
              onChangeText={(e) => handleSearchCountry(e)}
            />
          </View>
          <View className="flex flex-row flex-wrap gap-2 mt-4">
            {selectedCountries.map((v, idx) => (
              <Text
                key={`${v.region_code}-${v.country_code}-${idx}`}
                className="p-2 rounded bg-[#ebebeb] font-semibold"
              >
                {v.region_name}
              </Text>
            ))}
          </View>
        </View>
        <View className="flex flex-col min-h-screen px-6 py-2 gap-y-6">
          {searchCountries?.map((v, idx) => {
            const selected = selectedCountries.some(
              (item) =>
                item.region_code === v.region_code &&
                item.country_code === v.country_code
            );

            return (
              <Pressable
                key={`${v.region_code}-${v.country_code}-${v.region_name}-${idx}`}
                onPress={() => handleSelectedCountry(v)}
                className="flex flex-row items-center gap-x-2"
              >
                <MaterialCommunityIcons
                  name={selected ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={28}
                  color={selected ? "#000" : "#ccc"}
                />
                <View>
                  <Text className="text-xl">{v.region_name}</Text>
                  <Text className="mt-0.5 text-base text-gray-600">
                    {v.country_name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
