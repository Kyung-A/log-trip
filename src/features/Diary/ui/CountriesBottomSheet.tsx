import { Button, Pressable, Text, TextInput, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COUNTRIES } from "@/constants";
import { ICountry } from "../types";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

const SNAP_POINTS = ["100%"];

interface ICountriesBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  resultSelectedCountries: ICountry[];
  setResultSelectedCountries: React.Dispatch<React.SetStateAction<ICountry[]>>;
}

export default function CountriesBottomSheet({
  bottomSheetRef,
  resultSelectedCountries,
  setResultSelectedCountries,
}: ICountriesBottomSheetProps) {
  const [selectedCountries, setSelectedCountries] = useState<ICountry[]>([]);
  const [searchCountries, setSearchCountries] = useState<ICountry[]>(COUNTRIES);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index == -1) {
        setSelectedCountries(resultSelectedCountries);
      }
    },
    [resultSelectedCountries]
  );

  const handleSelectedCountry = useCallback((selectData: ICountry) => {
    setSelectedCountries((prev) => {
      const isSelected = prev.some(
        (data) =>
          data.code === selectData.code && data.country === selectData.country
      );

      if (isSelected) {
        return prev.filter(
          (p) =>
            !(p.code === selectData.code && p.country === selectData.country)
        );
      } else {
        return [...prev, selectData];
      }
    });
  }, []);

  const handleSearchCountry = useCallback((value) => {
    const newList = COUNTRIES.filter(
      (v) => v.name.includes(value) || v.countryName.includes(value)
    );
    setSearchCountries(newList);
  }, []);

  const handleSelectedFinish = useCallback(() => {
    bottomSheetRef.current.close();
    setResultSelectedCountries(selectedCountries);
  }, [selectedCountries]);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current.close();
    setSelectedCountries(resultSelectedCountries);
  }, [resultSelectedCountries]);

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
          <View className="flex flex-row items-center justify-between w-full">
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
                key={`${v.code}-${v.country}-${idx}`}
                className="p-2 rounded bg-[#ebebeb] font-semibold"
              >
                {v.name}
              </Text>
            ))}
          </View>
        </View>
        <View className="flex flex-col min-h-screen px-6 py-2 gap-y-6">
          {searchCountries.map((v, idx) => {
            const selected = selectedCountries.some(
              (item) => item.code === v.code && item.country === v.country
            );

            return (
              <Pressable
                key={`${v.code}-${v.country}-${v.name}-${idx}`}
                onPress={() => handleSelectedCountry(v)}
                className="flex flex-row items-center gap-x-2"
              >
                <MaterialCommunityIcons
                  name={selected ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={28}
                  color={selected ? "#000" : "#ccc"}
                />
                <View>
                  <Text className="text-xl">{v.name}</Text>
                  <Text className="mt-0.5 text-base text-gray-600">
                    {v.countryName}
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
